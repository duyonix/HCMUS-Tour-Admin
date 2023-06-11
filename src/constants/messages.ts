const messages = {
  LOGIN_SUCCESS: "Đăng nhập thành công",
  LOGIN_ERROR: "Đăng nhập thất bại. Vui lòng thử lại!",
  SESSION_EXPIRE: "Phiên đã hết hạn. Vui lòng đăng nhập lại!",
  PERMISSION_DENIED: "Bạn không có quyền để thực hiện điều này",
  TITLE_PERMISSION_DENIED: "Xin lỗi, bạn không có quyền để vào trang này",
  LEAVE:
    "Bạn có chắc muốn rời khỏi trang này. Mọi thay đổi sẽ không được lưu lại?",
  PAGE_NOT_FOUND: "Xin lỗi, trang bạn đang tìm kiếm không tồn tại",
  CREATE_SUCCESS: (text: string) => `Thêm mới ${text} thành công`,
  CREATE_FAILED: (text: string) => `Thêm mới ${text} thất bại`,
  EDIT_SUCCESS: (text: string) => `Cập nhật ${text} thành công`,
  EDIT_FAILED: (text: string) => `Cập nhật ${text} thất bại`,
  DELETE_SUCCESS: (text: string) => `Xóa ${text} thành công`,
  DELETE_FAILED: (text: string) => `Xóa ${text} thất bại`,
  IMPORT_SUCCESS: (text: string) => `Import ${text} thành công`,
  IMPORT_FAILED: (text: string) => `Import ${text} thất bại`,
  EXPORT_FAILED: (text: string) => `Export ${text} thất bại`,
  EXISTED: (text: string) => `${text} đã tồn tại`,
  NOT_EXIST: (text: string) => `${text} này không tồn tại`,
  CONFIRM_DELETE: (text: string) => `Bạn có chắc muốn xóa ${text} này?`,
  GET_DETAIL_FAILED: (text: string) => `Lấy thông tin ${text} thất bại`,
  HAS_BEEN_USED: (text: string) => `${text} đã được sử dụng`,
  INACTIVE: (text: string) => `${text} chưa được kích hoạt`,
  WRONG_FORMAT: (text: string) => `Sai định dạng ${text}`,
  NOT_FOUND: (text: string) => `${text} không tồn tại`,
  DUPLICATE_ENTITY: (text: string) => `${text} đã tồn tại`,
  ALREADY_USED_ELSEWHERE: (text: string) => `${text} đã được sử dụng`,
  NOT_SUITABLE: (text: string) => `${text} không phù hợp`,
  ARGUMENT_NOT_VALID:
    "Có lỗi trong các trường nhập liệu. Vui lòng kiểm tra lại",
  EXCEPTION: `Có lỗi xảy ra. Vui lòng thử lại sau`
};

export default messages;
