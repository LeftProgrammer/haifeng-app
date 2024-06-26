// 全局要用的类型放到这里

type IResData<T> = {
  code: number
  msg: string
  data: T
}

// uni.uploadFile文件上传参数
type IUniUploadFileOptions = {
  file?: File
  files?: UniApp.UploadFileOptionFiles[]
  filePath?: string
  name?: string
  formData?: any
}

type IUserInfo = {
  id: string
  avatar?: string
  username?: string
  name?: string
  departmentId?: string
  department?: string
  code?: string
  /** 微信的 openid，非微信没有这个字段 */
  openid?: string
}

enum TestEnum {
  A = 'a',
  B = 'b',
}
