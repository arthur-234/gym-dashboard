'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image, Video, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File, type: 'image' | 'video') => void
  onFileRemove: (type: 'image' | 'video') => void
  acceptedTypes: 'image' | 'video' | 'both'
  maxSize?: number // em MB
  currentImageUrl?: string
  currentVideoUrl?: string
  className?: string
}

interface UploadedFile {
  file: File
  preview: string
  type: 'image' | 'video'
  uploading: boolean
  progress: number
  uploaded: boolean
}

export default function FileUpload({
  onFileSelect,
  onFileRemove,
  acceptedTypes,
  maxSize = 10,
  currentImageUrl,
  currentVideoUrl,
  className
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<{
    image?: UploadedFile
    video?: UploadedFile
  }>({})
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File, type: 'image' | 'video'): string | null => {
    // Verificar tamanho
    if (file.size > maxSize * 1024 * 1024) {
      return `Arquivo muito grande. Máximo ${maxSize}MB permitido.`
    }

    // Verificar tipo
    if (type === 'image') {
      if (!file.type.startsWith('image/')) {
        return 'Apenas arquivos de imagem são permitidos.'
      }
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!allowedImageTypes.includes(file.type)) {
        return 'Formato de imagem não suportado. Use JPEG, PNG ou WebP.'
      }
    }

    if (type === 'video') {
      if (!file.type.startsWith('video/')) {
        return 'Apenas arquivos de vídeo são permitidos.'
      }
      const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg']
      if (!allowedVideoTypes.includes(file.type)) {
        return 'Formato de vídeo não suportado. Use MP4, WebM ou OGG.'
      }
    }

    return null
  }

  const handleFileSelect = (file: File, type: 'image' | 'video') => {
    setError(null)
    
    const validationError = validateFile(file, type)
    if (validationError) {
      setError(validationError)
      return
    }

    const preview = URL.createObjectURL(file)
    const uploadedFile: UploadedFile = {
      file,
      preview,
      type,
      uploading: true,
      progress: 0,
      uploaded: false
    }

    setUploadedFiles(prev => ({ ...prev, [type]: uploadedFile }))

    // Simular upload com progresso
    simulateUpload(type, file)
  }

  const simulateUpload = (type: 'image' | 'video', file: File) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadedFiles(prev => ({
          ...prev,
          [type]: prev[type] ? {
            ...prev[type],
            uploading: false,
            progress: 100,
            uploaded: true
          } : undefined
        }))
        onFileSelect(file, type)
      } else {
        setUploadedFiles(prev => ({
          ...prev,
          [type]: prev[type] ? {
            ...prev[type],
            progress
          } : undefined
        }))
      }
    }, 200)
  }

  const handleFileRemove = (type: 'image' | 'video') => {
    const file = uploadedFiles[type]
    if (file?.preview) {
      URL.revokeObjectURL(file.preview)
    }
    setUploadedFiles(prev => {
      const newFiles = { ...prev }
      delete newFiles[type]
      return newFiles
    })
    onFileRemove(type)
    setError(null)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/') && (acceptedTypes === 'image' || acceptedTypes === 'both')) {
        handleFileSelect(file, 'image')
      } else if (file.type.startsWith('video/') && (acceptedTypes === 'video' || acceptedTypes === 'both')) {
        handleFileSelect(file, 'video')
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file, type)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          'hover:border-primary hover:bg-primary/5'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Upload de Arquivos</h3>
        <p className="text-muted-foreground mb-4">
          Arraste e solte arquivos aqui ou clique para selecionar
        </p>
        <div className="flex gap-2 justify-center">
          {(acceptedTypes === 'image' || acceptedTypes === 'both') && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                disabled={!!uploadedFiles.image}
              >
                <Image className="h-4 w-4 mr-2" />
                Selecionar Imagem
              </Button>
              <Input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={(e) => handleInputChange(e, 'image')}
                className="hidden"
              />
            </>
          )}
          {(acceptedTypes === 'video' || acceptedTypes === 'both') && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                disabled={!!uploadedFiles.video}
              >
                <Video className="h-4 w-4 mr-2" />
                Selecionar Vídeo
              </Button>
              <Input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/ogg"
                onChange={(e) => handleInputChange(e, 'video')}
                className="hidden"
              />
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Máximo {maxSize}MB por arquivo
        </p>
      </div>

      {/* Current Files */}
      {(currentImageUrl || currentVideoUrl) && (
        <div className="space-y-2">
          <Label>Arquivos Atuais</Label>
          <div className="grid gap-2">
            {currentImageUrl && (
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      <span className="text-sm">Imagem atual</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onFileRemove('image')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            {currentVideoUrl && (
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      <span className="text-sm">Vídeo atual</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onFileRemove('video')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {(uploadedFiles.image || uploadedFiles.video) && (
        <div className="space-y-2">
          <Label>Arquivos Selecionados</Label>
          <div className="grid gap-2">
            {uploadedFiles.image && (
              <Card>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        <span className="text-sm font-medium">{uploadedFiles.image.file.name}</span>
                        {uploadedFiles.image.uploaded && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileRemove('image')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {uploadedFiles.image.uploading && (
                      <div className="space-y-1">
                        <Progress value={uploadedFiles.image.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Enviando... {Math.round(uploadedFiles.image.progress)}%
                        </p>
                      </div>
                    )}
                    {uploadedFiles.image.preview && (
                      <div className="mt-2">
                        <img
                          src={uploadedFiles.image.preview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            {uploadedFiles.video && (
              <Card>
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        <span className="text-sm font-medium">{uploadedFiles.video.file.name}</span>
                        {uploadedFiles.video.uploaded && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFileRemove('video')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    {uploadedFiles.video.uploading && (
                      <div className="space-y-1">
                        <Progress value={uploadedFiles.video.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          Enviando... {Math.round(uploadedFiles.video.progress)}%
                        </p>
                      </div>
                    )}
                    {uploadedFiles.video.preview && (
                      <div className="mt-2">
                        <video
                          src={uploadedFiles.video.preview}
                          className="w-full h-32 object-cover rounded border"
                          controls
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}