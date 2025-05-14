import { AuthApi } from './Api';

export const RolesService = {
    async getData() {
        return AuthApi.client().get('gateway/idp/role');
    },

    async getById(msroleId) {
        const response = await AuthApi.client().get('gateway/idp/role/' + msroleId);
        return response.data.data[0];
    }
};
