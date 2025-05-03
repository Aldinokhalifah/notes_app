export function checkInactivity(maxInactivity = 30 * 60 * 1000) { // default: 30 menit
    const lastAcitivity = localStorage.getItem("lastActivity");
    const now = Date.now();

    if(lastAcitivity && now - lastAcitivity > maxInactivity) {
        localStorage.removeItem("token");
        localStorage.removeItem("lastActivity");
        return true;
    }

    return false;
}