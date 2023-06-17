import BaseService from "@/services/BaseService";
const PREFIX = process.env.SERVER + "/api/v1/users";

export default class UserService extends BaseService {
  async getUsers(params: any) {
    try {
      const res = await super.send("GET", PREFIX, super.header(), null, params);
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async getUser(id: string) {
    try {
      const res = await super.send("GET", `${PREFIX}/${id}`, super.header());
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async updateProfile(data: any) {
    try {
      const res = await super.send(
        "PUT",
        `${PREFIX}/update-profile`,
        super.header(),
        data
      );
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async updatePassword(data: any) {
    try {
      const res = await super.send(
        "PUT",
        `${PREFIX}/update-password`,
        super.header(),
        data
      );
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }

  async updateRole(id: string, data: any) {
    try {
      const res = await super.send(
        "PUT",
        `${PREFIX}/${id}/update-role`,
        super.header(),
        data
      );
      return res.data;
    } catch (err: any) {
      return super.errorResponse(err);
    }
  }
}
