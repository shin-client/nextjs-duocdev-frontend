import { mediaApiRequest } from "@/apiRequests/media"
import { useMutation } from "@tanstack/react-query"

export const useUploadMediaMution = () => {
  return useMutation({
    mutationFn: mediaApiRequest.upload
  })
}