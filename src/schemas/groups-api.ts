import { newValidator, Obj, Arr, IGNORE, Nullable, Optional, BOOL } from 'typesafe-schema';
import { STRING, NUMBER } from 'typesafe-schema';

const pageCursorDefinition = Obj({
    nextCursor: Nullable(STRING),
    prevCursor: Nullable(STRING),
});

const groupDefinition = Obj({
    id: STRING,
    name: STRING,
    authzResource: STRING,
    contactId: Nullable(STRING),
    counts:  Obj({
        users: NUMBER,
        devices: NUMBER,
        meshes: NUMBER,
        children: NUMBER,
    }),
    path: Arr(Obj({
        id: STRING,
        name: STRING,
    })),
});

export const groupsResponse = newValidator(Obj({
    data: Arr(groupDefinition),
    meta: pageCursorDefinition,
}));

export const groupResponse = newValidator(Arr(groupDefinition));

export const devicesResponse = newValidator(Obj({
    data: Arr(Obj({ id: STRING })),
    meta: pageCursorDefinition,
}));

export const groupServiceSearchDevicesResponse = newValidator(Obj({
    data: Arr(Obj({
        id: STRING,
    })),
}));

const userDefinition = Obj({
    id: STRING,
    username: STRING,
    firstName: STRING,
    lastName: STRING,
    counts: Obj({
        groups: NUMBER,
    }),
    attributes: Obj({
        userId: STRING,
    }),
    email: STRING,
    emailVerified: BOOL,
    enabled: BOOL,
    role: Obj({
        id: STRING,
        name: STRING,
    }),
});

export const usersResponse = newValidator(Obj({
    data: Arr(userDefinition),
    meta: pageCursorDefinition,
}));

export const userResponse = newValidator(userDefinition);


const roleDefinition = Obj({
    id: STRING,
    name: STRING,
});

export const rolesResponse = newValidator(Obj({
    data: Arr(roleDefinition),
    meta: pageCursorDefinition,
}));


// Schema for Groups Service standard JSON response
export const groupsStdResponseSchema = newValidator(Obj({
    message: STRING,
    data: Optional(Nullable(IGNORE)),
}));