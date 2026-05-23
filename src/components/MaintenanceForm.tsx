import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { useMaintenance } from '../hooks/useMaintenance'
import { Upload, X, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import type { Maintenance } from '../types'

const maintenanceSchema = z.object({
  maintenanceDetails: z.string().min(10, '维修详情至少 10 个字符'),
})

type MaintenanceFormData = z.infer<typeof maintenanceSchema>

interface MaintenanceFormProps {
  maintenance: Maintenance
  onSuccess?: () => void
}

export function MaintenanceForm({ maintenance, onSuccess }: MaintenanceFormProps) {
  const { completeMaintenance } = useMaintenance()
  const [images, setImages] = useState<ImageListType>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
  })

  const onImageUpload = (imageList: ImageListType) => {
    if (imageList.length + images.length > 5) {
      toast.error('最多只能上传 5 张图片')
      return
    }
    setImages([...images, ...imageList])
  }

  const onImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: MaintenanceFormData) => {
    if (images.length === 0) {
      toast.error('请至少上传一张照片')
      return
    }

    try {
      setIsSubmitting(true)

      // 转换图片为 Base64
      const imageBase64 = images.map((img) => img.dataURL as string)

      await completeMaintenance(maintenance.id, data.maintenanceDetails, imageBase64)

      reset()
      setImages([])
      onSuccess?.()
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 维修信息 */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3">维修信息</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>维修单号: {maintenance.code}</p>
          <p>设备: {maintenance.deviceName}</p>
          <p>维修类型: {maintenance.type}</p>
          <p>维修员: {maintenance.maintainerName}</p>
        </div>
      </div>

      {/* 维修详情 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">维修详情</label>
        <textarea
          {...register('maintenanceDetails')}
          placeholder="请详细描述维修过程和结果..."
          rows={5}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.maintenanceDetails && (
          <p className="text-sm text-red-600 mt-1">{errors.maintenanceDetails.message}</p>
        )}
      </div>

      {/* 维修照片 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          维修照片 ({images.length}/5) <span className="text-red-600">*</span>
        </label>
        <ImageUploading
          value={images}
          onChange={onImageUpload}
          maxNumber={5}
          multiple
          acceptType={['jpg', 'jpeg', 'png']}
        >
          {({ imageList, onImageUpload: handleUpload }) => (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleUpload}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition flex flex-col items-center gap-2"
              >
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-600">点击或拖拽上传维修照片</span>
              </button>

              {imageList.length > 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    {imageList.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.dataURL}
                          alt={`preview-${index}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => onImageRemove(index)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ImageUploading>
        {images.length === 0 && (
          <p className="text-sm text-red-600 mt-1">请至少上传一张照片</p>
        )}
      </div>

      {/* 提交按钮 */}
      <button
        type="submit"
        disabled={isSubmitting || images.length === 0}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        {isSubmitting ? '提交中...' : '完成维修'}
      </button>
    </form>
  )
}
