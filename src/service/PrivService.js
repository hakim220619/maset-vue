import { AuthApi } from './Api';

export const PrivService = {
    async getData() {
        return AuthApi.client().get('api/releases/group');
    },
    async destroy(id) {
        return AuthApi.client().delete('api/releases/group/' + id);
    }
};
