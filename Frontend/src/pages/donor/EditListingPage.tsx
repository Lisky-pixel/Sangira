import { useParams } from 'react-router'
import { PostListingPage } from './PostListingPage'

export function EditListingPage() {
  const { id } = useParams<{ id: string }>()

  if (!id) {
    return null
  }

  return <PostListingPage editListingId={id} />
}
