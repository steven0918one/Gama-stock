export function errorsSetter(error) {
    let errObj = {};
    if (error?.response?.status === 422) {
        for (const [key, value] of Object.entries(
            error?.response?.data?.detail
        )) {
            errObj = { ...errObj, [key]: value[0] };
        }
    }
    return errObj;
}