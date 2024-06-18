import { deletePreviousDayData } from '@/lib/utils_db'

const deleteOldDataJob = async (req: any, res: any) => {
  try {
    await deletePreviousDayData()
    res.send({ message: 'deletePreviousDayData was executed!' })
  } catch (error) {
    console.log(error)
  }
}

export default deleteOldDataJob
