
import { createSlice } from '@reduxjs/toolkit'

interface userAuth {
    token: string
}

const initialState: userAuth = {
    token: ''
}

const authToken = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authtication: (state, action) => {
            state.token = action.payload
        }
    }
})

export const { authtication } = authToken.actions;
export default authToken.reducer;