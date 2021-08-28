export function isValidJsonSchemaString(str: string) {
    try {
        const parsedJSON = JSON.parse(str);
        if (typeof parsedJSON !== 'object' || parsedJSON === null) {
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
}

export function validateJSONSchema(str: string): JSONIsValid | JSONInvalid {
    try {
        const obj = JSON.parse(str);
        if (typeof obj !== 'object' || obj === null) {
            return {
                success: false,
                reason: `JSON Schema are JSON object`,
            };
        }
    } catch (e) {
        return {
            success: false,
            reason: e.message as string,
        };
    }

    return {
        success: true,
    };
}

interface JSONIsValid {
    success: true
}

interface JSONInvalid {
    success: false
    reason: string
}