
// Check if string has special characters
export function hasSpecialChars(value, allowed = []) {
    const checks = [];
    checks.push(/[`!#$%^&*()+\=\[\]{};':"\\|,<>?~]/);
    if (!allowed.includes('@')) checks.push(/[@]/);
    if (!allowed.includes('-')) checks.push(/[-]/);
    if (!allowed.includes('_')) checks.push(/[_]/);
    if (!allowed.includes('.')) checks.push(/[.]/);
    if (!allowed.includes(' ')) checks.push(/[ ]/);
    if (!allowed.includes('/')) checks.push(/[/]/);

    let result = false;
    checks.forEach((rgx) => {
        if (rgx.test(value)) {
            result = true;
        }
    });
    return result;
}

// Check if string is a valid email
export function isValidEmail(value) {
    if (/\S+@\S+\.\S+/.test(value) && !hasSpecialChars(value, ['.', '@'])) {
        return true;
    }
    return false;
}