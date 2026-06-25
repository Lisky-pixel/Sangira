import { getOrgInitials } from '../../lib/org-initials'
import { CLOUDINARY_DELIVERY_WIDTH } from '../../constants/cloudinary-delivery'
import { cloudinaryDeliveryUrl } from '../../lib/cloudinary-delivery-url'
import { cn } from '../../lib/utils'

const sizeStyles = {
  sm: {
    container: 'size-8',
    text: 'text-xs',
  },
  md: {
    container: 'size-10',
    text: 'text-sm',
  },
} as const

type AccountAvatarSize = keyof typeof sizeStyles

type AccountAvatarProps = {
  name: string
  avatarUrl?: string
  size?: AccountAvatarSize
  className?: string
}

export function AccountAvatar({
  name,
  avatarUrl,
  size = 'sm',
  className,
}: AccountAvatarProps) {
  const initials = getOrgInitials(name)
  const styles = sizeStyles[size]

  if (avatarUrl) {
    const deliveryUrl = cloudinaryDeliveryUrl(
      avatarUrl,
      CLOUDINARY_DELIVERY_WIDTH.AVATAR,
    )
    return (
      <img
        src={deliveryUrl}
        alt=""
        className={cn(styles.container, 'rounded-full object-cover', className)}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'bg-primary flex items-center justify-center rounded-full font-semibold text-white',
        styles.container,
        styles.text,
        className,
      )}
    >
      {initials}
    </span>
  )
}
