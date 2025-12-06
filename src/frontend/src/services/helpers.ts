const MAX_FILE_SIZE = 2000000 // 2MB

export function imageFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(file.type)
      // reject('O arquivo não é uma imagem!')
    } else if (file.size > MAX_FILE_SIZE) {
      reject('O arquivo é muito grande!')
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as data URL.'))
      }
    }

    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}
