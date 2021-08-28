import { newValidator, EnumObj, Obj, Arr, BOOL, Nullable } from 'typesafe-schema';
import { NUMBER, STRING } from 'typesafe-schema';

const errorDefinition = Obj({
    HttpCode: NUMBER,
    Key: STRING,
    Message: STRING,
});

export const acsErrorSchema = newValidator(errorDefinition);

// Schema for /acs/configurations/owners/:owner_id
export const acsOwnerConfigurations = newValidator(EnumObj(
    // Error
    errorDefinition,
    // Success
    Obj({
        ownerId: STRING, // Same as parameter provided
        certificate: Obj({
            serialNumber: STRING, // Not the same as unit serial
            certificate: STRING,
            privateKey: STRING, // wut?
        }),
    }),
));

// Schema for /ac/partner
export const partnersResponse = newValidator(Arr(Obj({
    partnerId: STRING,
    name: STRING,
    description: STRING,
    updatedAt: NUMBER,
    updatedBy: Nullable(STRING),
})));

// Schema for /ac/partner/:partnerId
export const partnerResponse = newValidator(Obj({
    partnerId: STRING,
    name: STRING,
    description: STRING,
    updatedAt: NUMBER,
    updatedBy: Nullable(STRING),
    userIds: Arr(NUMBER),
}));

// Schema for /ac/partner/user/:userId
export const userPartnerResponse = newValidator(Obj({
    partnerId: STRING,
}));

const applicationDefinition = Obj({
    id: STRING,
    partnerId: STRING,
    version: STRING,
    title: STRING,
    aclId: Nullable(NUMBER), // if this field is null it means app is public
    aclName: Nullable(STRING),
    description: Nullable(STRING),
    learnMore: Nullable(STRING),
    features: Arr(Nullable(STRING)),
    active: BOOL,
    public: BOOL,
    lastUpdatedAt: Nullable(STRING),
    lastUpdatedBy: Nullable(STRING),
    packageConfigDataSchema: Nullable(STRING),
    persistentUuids: Arr(STRING),
    packageCommercialId: STRING,
    appContainers: Arr(STRING),
});

// Schema for /ac/partner/:partnerId/package
export const partnerApplicationsResponse = newValidator(Obj({
    results: Arr(applicationDefinition),
    total: NUMBER,
}));

// Schema for /ac/partner/:partnerId/acl
export const aclsResponse = newValidator(Arr(Obj({
    id: NUMBER,
    name: STRING,
    updatedAt: NUMBER,
    updatedBy: Nullable(STRING),
    description: Nullable(STRING),
    partnerId: STRING,
})));

// Schema for /ac/partner/:partnerId/acl/:aclId/user
export const aclResponse = newValidator(Obj({
    id: NUMBER,
    name: STRING,
    updatedAt: NUMBER,
    updatedBy: Nullable(STRING),
    description: Nullable(STRING),
    partnerId: STRING,
    members: Arr(NUMBER),
}));

// Schema for /ac/partner/:partnerId/package/:packageId
export const partnerApplicationResponse = newValidator(applicationDefinition);

// Schema for /ac/configurations/owners/:ownerId
export const ownerConfigurationResponse = newValidator(Obj({
    certificate: Obj({
        serialNumber: STRING,
        certificate: STRING,
        privateKey: STRING,
    }),
}));