import { supabase } from './supabase'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Upload a file to Supabase Storage
 */
export const uploadFile = async (
  file: File,
  bucket: string = 'audit-photos',
  path?: string
): Promise<UploadResult> => {
  try {
    // Validate file first
    const validation = validateFile(file)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || 'Invalid file'
      }
    }

    // Generate file path
    const fileExt = file.name.split('.').pop()
    const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `audit-photos/${fileName}`

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return {
        success: false,
        error: uploadError.message || 'Upload failed'
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrl
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: error.message || 'Upload failed'
    }
  }
}

/**
 * Delete a file from Supabase Storage
 */
export const deleteFile = async (
  url: string,
  bucket: string = 'audit-photos'
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Extract file path from URL
    const urlParts = url.split('/')
    const filePath = urlParts.slice(urlParts.indexOf(bucket) + 1).join('/')

    if (!filePath) {
      return {
        success: false,
        error: 'Could not extract file path from URL'
      }
    }

    // Delete from Supabase Storage
    const { error: deleteError } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (deleteError) {
      console.error('Supabase delete error:', deleteError)
      return {
        success: false,
        error: deleteError.message || 'Delete failed'
      }
    }

    return {
      success: true
    }
  } catch (error: any) {
    console.error('Delete error:', error)
    return {
      success: false,
      error: error.message || 'Delete failed'
    }
  }
}

/**
 * Validate file before upload
 */
export const validateFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Bestand is te groot. Maximum grootte is 10MB.' }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Alleen JPEG, PNG en WebP bestanden zijn toegestaan.' }
  }
  
  return { valid: true }
}

/**
 * Upload multiple files
 */
export const uploadMultipleFiles = async (
  files: File[],
  bucket: string = 'audit-photos',
  pathPrefix?: string
): Promise<{ success: boolean; urls?: string[]; errors?: string[] }> => {
  const results = await Promise.all(
    files.map(file => {
      const path = pathPrefix ? `${pathPrefix}/${file.name}` : undefined
      return uploadFile(file, bucket, path)
    })
  )

  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)

  if (failed.length > 0) {
    return {
      success: false,
      urls: successful.map(r => r.url!).filter(Boolean),
      errors: failed.map(r => r.error!).filter(Boolean)
    }
  }

  return {
    success: true,
    urls: results.map(r => r.url!).filter(Boolean)
  }
}