
export const cleanPayload = (data: any): any => {
    if (Array.isArray(data)) {
        return data.map(cleanPayload);
    } else if (data !== null && typeof data === 'object') {
        const newData: any = {};
        for (const key in data) {
            if (key === '__typename' || key === 'crewsInfo') continue;
            newData[key] = cleanPayload(data[key]);
        }
        return newData;
    }
    return data;
};
