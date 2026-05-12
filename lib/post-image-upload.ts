import "server-only";

export {
  EVENT_GALLERY_MAX_BYTES as POST_IMAGE_MAX_BYTES,
  isAllowedEventGalleryMime as isAllowedPostImageMime,
} from "@/lib/event-gallery-upload";
