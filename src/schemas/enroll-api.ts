import { newValidator, Nullable, Obj, IGNORE, Enum } from 'typesafe-schema';
import { Arr, NUMBER, BOOL, STRING, Optional, TypeOf } from 'typesafe-schema';

export type NonSchemaPackageDefinition = TypeOf<typeof packageDefinition>;

// Schema for a package
const packageDefinition = Obj({
    packageId: STRING,
    title: STRING,
    type: Enum('Premium', 'Freemium', 'Basic'),
    pricing: Nullable(STRING),
    description: Nullable(STRING),
    learnMore: Nullable(STRING),
    features: Arr(Nullable(STRING)),
    active: BOOL,
    expires: Nullable(STRING),
    createdAt: STRING,
    storeProductId: Nullable(STRING),
    appContainers: Arr(STRING),
    version: STRING,
    persistentUuids: Arr(STRING),
    packageConfigDataSchema: Nullable(STRING),
    packageCommercialId: STRING,
    packageApplicationTypes: Arr(STRING),
});

// Schema for /es/enroll/packages
export const allPackages = newValidator(Obj({
    meta: Obj({
        status: NUMBER,
        message: Nullable(STRING),
    }),
    response: Arr(packageDefinition),
}));

// Schema for /es/enroll/user/:userId/config
export const enrollUserConfig = newValidator(Obj({
    meta: Obj({
        status: NUMBER,
        message: Nullable(STRING),
    }),
    response: Obj({
        // What is that field for? Is this relevant for the frontend??
        beacons: IGNORE,
        meshes: Optional(Arr(Obj({
            id: Nullable(STRING),
            name: Nullable(STRING),
            nc_node_country: Nullable(STRING),
            nc_node_timezone_area: Nullable(STRING),
            nc_node_timezone_region: Nullable(STRING),
            devices: Arr(Obj({
                id: Nullable(STRING),
                name: Nullable(STRING),
                isMEN: Nullable(BOOL),
                status: Nullable(STRING),
                progress: Nullable(NUMBER),
                error: Nullable(Obj({
                    code: Nullable(NUMBER),
                    message: Nullable(STRING),
                    logs: Nullable(STRING),
                })),
                packages: Arr(packageDefinition),
            })),
        }))),
    }),
}));

// Schema for /es/device/:deviceId/certs/azure
export const azureCertificate = newValidator(Obj({
    meta: Obj({
        status: NUMBER,
        message: Nullable(STRING),
    }),
    response: Obj({
        filename: STRING,
        certificate: STRING,
    }),
}));

// N/A

// Schema for /es/subscription/downgrade
// N/A

// Schema for /es/subscription/packages/mesh/:mesh_id
// TBD

// Schema for /es/subscription/user/:user_id/availableUpdates
export const availableUpdates = newValidator(Obj({
    meta: Obj({
        status: NUMBER,
        message: Nullable(STRING),
    }),
    response: Obj({
        updates: Arr(Obj({
            package: Obj({
                packageId: STRING,
                version: STRING,
                title: STRING,
                type: Enum('Premium', 'Freemium', 'Basic'),
            }),
            packageUpdate: Nullable(Obj({
                packageId: STRING,
                version: STRING,
                storeProductId: Nullable(STRING),
            })),
        })),
    }),
}));