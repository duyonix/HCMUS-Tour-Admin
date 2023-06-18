import { put, call, takeLatest, all } from "redux-saga/effects";
import AuthService from "@/services/auth";
import UserService from "@/services/user";
import { authActions } from "./auth.slice";
import messages from "@/constants/messages";
import variables from "@/constants/variables";
import _ from "lodash";
import { toast } from "react-toastify";

function* login(action: any) {
  const authService = new AuthService();
  yield put(authActions.loginRequest());
  const res = yield call(authService.login, action.payload);
  if (res?.status === variables.OK) {
    localStorage.setItem("access_token", res.payload.token);
    localStorage.setItem("user_id", res.payload.user.id);
    yield put(authActions.loginSuccess(res.payload));

    toast.success(messages.LOGIN_SUCCESS);
  } else {
    toast.error(messages.LOGIN_ERROR);
    yield put(authActions.loginError({ message: messages.LOGIN_ERROR }));
  }
}

function* getInfo(action: any) {
  const userService = new UserService();
  const res = yield call(userService.getUser, action.payload);
  if (res?.status === variables.OK) {
    yield put(authActions.getInfoSuccess(res.payload));
  } else {
    yield put(authActions.getInfoError({ message: "Lấy thông tin thất bại" }));
  }
}

export default function* authSaga() {
  yield takeLatest(authActions.login.type, login);
  yield takeLatest(authActions.getInfo.type, getInfo);
}
