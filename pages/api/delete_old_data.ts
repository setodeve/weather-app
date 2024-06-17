import { deletePreviousDayData } from '@/lib/utils_db'

const deleteOldDataJob = async () => {
  await deletePreviousDayData()
}

export default deleteOldDataJob
