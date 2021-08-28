import { ajax } from 'rxjs/ajax';

export async function logoutPrivafy() {
    await ajax({
        url: `${window.PRIVAFY_BASE_URL}/oauth/logout`,
        method: 'GET',
        withCredentials: true,
    }).toPromise();
}