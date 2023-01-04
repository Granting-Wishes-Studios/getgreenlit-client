import { UserAuth } from '../networking/spaces'

function toUserAuth(user: any): UserAuth {
    const userAuth: UserAuth = {
        userId: (!user) ? '' : user.userId,
        address: user.address,
        sessionToken: (!user) ? '' : user.sessionToken
    }

    return userAuth;
}

export { toUserAuth }