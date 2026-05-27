import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { useRepair } from '../hooks/useRepair'
import { Upload, X, Send } from 'lucide-react'
import { toast } from 'sonner'

const repairSchema = z.object({
  deviceId: z.number().min(1, '璇烽€夋嫨璁惧'),
  description: z.string().min(10, '鎻忚堪鑷冲皯 10 涓瓧绗?),
  priority: z.enum(['low', 'medium', 'high']),
})

type RepairFormData = z.infer<typeof repairSchema>

export function RepairForm({ onSuccess }: { onSuccess?: () => void }) {
  const { devices, searchQuery, createRepair, setSearchQuery } = useRepair()
  const [images, setImages] = useState<ImageListType>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RepairFormData>({
    resolver: zodResolver(repairSchema),
  })

  const onImageUpload = (imageList: ImageListType) => {
    if (imageList.length + images.length > 5) {
      toast.error('鏈€澶氬彧鑳戒笂浼?5 寮犲浘鐗?)
      return
    }
    setImages([...images, ...imageList])
  }

  const onImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: RepairFormData) => {
    try {
      setIsSubmitting(true)

      // 杞崲鍥剧墖涓?Base64
      const imageBase64 = images.map((img) => img.dataURL as string)

      await createRepair({
        deviceId: data.deviceId,
        description: data.description,
        priority: data.priority,
        images: imageBase64,
      })

      reset()
      setImages([])
      setSearchQuery('')
      onSuccess?.()
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 璁惧閫夋嫨 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">璁惧</label>
        <div className="space-y-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="鎼滅储璁惧..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {searchQuery && devices.length > 0 && (
            <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
              {devices.map((device) => (
                <button
                  key={device.id}
                  type="button"
                  onClick={() => {
                    register('deviceId').onChange({ target: { value: device.id } })
                    setSearchQuery('')
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                >
                  <p className="font-medium text-gray-900">{device.code}</p>
                  <p className="text-sm text-gray-600">{device.name}</p>
                </button>
              ))}
            </div>
          )}

          {searchQuery && devices.length === 0 && (
            <p className="text-sm text-gray-500">鏈壘鍒板尮閰嶇殑璁惧</p>
          )}
        </div>
        {errors.deviceId && <p className="text-sm text-red-600 mt-1">{errors.deviceId.message}</p>}
      </div>

      {/* 鏁呴殰鎻忚堪 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">鏁呴殰鎻忚堪</label>
        <textarea
          {...register('description')}
          placeholder="璇疯缁嗘弿杩版晠闅滄儏鍐?.."
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* 浼樺厛绾?*/}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">浼樺厛绾?/label>
        <select
          {...register('priority')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="low">浣?/option>
          <option value="medium">涓?/option>
          <option value="high">楂?/option>
        </select>
        {errors.priority && <p className="text-sm text-red-600 mt-1">{errors.priority.message}</p>}
      </div>

      {/* 鍥剧墖涓婁紶 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          涓婁紶鐓х墖 ({images.length}/5)
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
                <span className="text-sm text-gray-600">鐐瑰嚮鎴栨嫋鎷戒笂浼犲浘鐗?/span>
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
      </div>

      {/* 鎻愪氦鎸夐挳 */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
      >
        <Send className="w-5 h-5" />
        {isSubmitting ? '鎻愪氦涓?..' : '鎻愪氦维修单}
      </button>
    </form>
  )
}
