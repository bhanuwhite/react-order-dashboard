import { newValidator, Obj, EnumObj, Arr, Str, Any, Nullable, IGNORE, Optional, Dict, Enum } from 'typesafe-schema';
import { BOOL, TRUE, FALSE, STRING, NUMBER } from 'typesafe-schema';



// Success response from an endpoint when we ignore the response object
export const selfAPIIgnoreResponse = newSelfAPI(Optional(IGNORE));

// Refresh page response for all request
export const requireLoginResponse = newValidator(Obj({
    success: FALSE,
    message: STRING,
    code: NUMBER,
}));

// Response for /refresh-session
export const refreshSessionResponse = newSelfAPI(Obj({
    email: STRING,
    firstName: STRING,
    lastName: Optional(STRING),
    groups: Arr(STRING),
}));

// Response for /enrollment/unenroll
export const unenrollResponse = newSelfAPI(
    Optional(IGNORE),
);

// Response for /subscriptions/upgrade
export const upgradeResponse = newSelfAPI(
    Obj({
        will_reboot: BOOL,
    }),
);

// Response for /subscriptions/update
export const updateResponse = newValidator(EnumObj(
    Obj({
        success: TRUE,
    }),
    Obj({
        success: FALSE,
        message: STRING,
    }),
));

// Response for /subscriptions/whitelist/:unitSerial
export const whitelistedResponse = newSelfAPI(
    Dict(BOOL),
);

// Response for /subscriptions/downgrade
export const downgradeResponse = upgradeResponse;

// Response for /subscriptions/whitelist
export const addToWhitelistResponse = unenrollResponse;

// Response for /subscriptions/remove-whitelist
export const removeFromWhitelistResponse = unenrollResponse;

// Response for /account/feature-preview
export const toggleFeaturePreviewResponse = unenrollResponse;

const cardDefinition = Obj({
    id: STRING,
    type: Str('card'),
    default: BOOL,
    last4: STRING,
    brand: STRING,
    cardholder_name: Nullable(STRING),
    address_line1: Nullable(STRING),
    address_line2: Nullable(STRING),
    city: Nullable(STRING),
    zip_code: Nullable(STRING),
    country: Nullable(STRING),
    state: Nullable(STRING),
    exp_month: NUMBER,
    exp_year: NUMBER,
});

const subscriptionDefinition = Obj({
    id: STRING,
    price: NUMBER,
    node_serial: Nullable(STRING),
    package_id: Nullable(STRING),
    mesh_id: Nullable(STRING),
    mesh_uuid: Nullable(STRING),
    cancel_at_period_end: BOOL,
    canceled_at: Nullable(NUMBER),
    cancel_at: Nullable(NUMBER),
    status: Enum('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid'),
});

// Response for /subscriptions/all
export const allSubscriptionsResponse = newSelfAPI(
    Obj({
        subscriptions: Arr(subscriptionDefinition),
    }),
);

// Response for PATCH /subscriptions/:subscriptionIds
export const patchedSubscriptionResponse = newSelfAPI(
    Obj({
        subscriptions: Arr(subscriptionDefinition),
    }),
);

// Response for /account/payment/details
export const paymentDetailsResponse = newSelfAPI(
    Obj({
        sources: Arr(cardDefinition),
        subscriptions: Arr(subscriptionDefinition),
        billingAddress: Nullable(Obj({
            city: Nullable(STRING),
            country: Nullable(STRING),
            line1: Nullable(STRING),
            line2: Nullable(STRING),
            postal_code: Nullable(STRING),
            state: Nullable(STRING),
        })),
    }),
);

// Response for /account/payment/cards/new
export const paymentAddCardResponse = newSelfAPI(
    cardDefinition,
);

// Response for /account/payment/cards/${id}
export const paymentDeleteCardResponse = newSelfAPI(
    Obj({
        defaultSource: Nullable(STRING),
    }),
);

// Response for /account/payment/customer
export const paymentDefaultCardResponse = newSelfAPI(
    Obj({
        defaultSource: STRING,
    }),
);

// Response for /account/debug-options
export const toggleDebugOptionsResponse = unenrollResponse;

// Response for /users/ and /users/:userId
export const keycloakUsersResponse = newSelfAPI(Arr(Obj({
    id: STRING,
    username: STRING,
    enabled: Optional(BOOL),
    firstName: Optional(STRING),
    lastName: Optional(STRING),
    email: Optional(STRING),
    emailVerified: Optional(BOOL),
    attributes: Obj({
        phoneNumber: Optional(Arr(STRING)),
        userId: Optional(Arr(STRING)),
        allowReceiveSms: Optional(Arr(STRING)),
        company: Optional(Arr(STRING)),
        countryCode: Optional(Arr(STRING)),
    }),
})));

// Response for /invitations
export const invitationsResponse = newSelfAPI(Arr(Obj({
    inv_id: STRING,
    group_id: STRING,
    group_name: STRING,
    created_by: NUMBER,
    created_at: STRING,
})));

// Response for /invitations/groups/:groupId
export const invitationsInGroupResponse = newSelfAPI(Arr(Obj({
    inv_id: STRING,
    user_id: Optional(STRING),
    user_email: Optional(STRING),
    created_by: NUMBER,
    created_at: STRING,
})));

// Response for /invitations/:invIds/accept
export const invitationsAcceptResonse = newSelfAPI(Arr(STRING));

// Response for /vtpn/place-order
export const placeOrderResponse = newSelfAPI(Obj({
    confirmationId: STRING,
}));

// Response for /vtpn/inventory?skus=:skus
export const fulfillableDevicesResponse = newSelfAPI(Dict(Obj({
    error: Nullable(STRING),
    total: NUMBER,
})));

// Response for /realm/min-password-length
export const minPasswordLengthResponse = newSelfAPI(Obj({
    minPasswordLength: NUMBER,
}));

const upsSuccessResponseDefinition = Obj({
    ResponseStatus: Obj({
        Code: STRING,
        Description: STRING,
    }),
});

const upsAddressCandidateDefinition = Obj({
    AddressKeyFormat: EnumObj(
        Obj({
            AddressLine: STRING,
            PoliticalDivision1: STRING,
            PoliticalDivision2: STRING,
            PostcodePrimaryLow: STRING,
        }),
        Obj({
            AddressLine: Arr(STRING),
            PoliticalDivision1: STRING,
            PoliticalDivision2: STRING,
            PostcodePrimaryLow: STRING,
        }),
    ),
});

// Response for /ups/validate-address
export const validateShippingResponse = newSelfAPI(EnumObj(
    Obj({
        XAVResponse: EnumObj(
            Obj({
                NoCandidatesIndicator: STRING,
                Response: upsSuccessResponseDefinition,
            }),
            Obj({
                ValidAddressIndicator: STRING,
                Candidate: upsAddressCandidateDefinition,
                Response: upsSuccessResponseDefinition,
            }),
            Obj({
                AmbiguousAddressIndicator: STRING,
                Candidate: Arr(upsAddressCandidateDefinition),
                Response: upsSuccessResponseDefinition,
            }),
        ),
    }),
    Obj({
        response: Obj({
            errors: Arr(Obj({
                code: STRING,
                message: STRING,
            })),
        }),
    }),
));

// Helper

function newSelfAPI<T extends Any>(schema: T) {
    return newValidator(EnumObj(
        Obj({
            success: TRUE,
            response: schema,
        }),
        Obj({
            success: FALSE,
            message: STRING,
        }),
    ));
}

export type SelfAPIResult<T = unknown> = SelfAPISuccess<T> | SelfAPIError;

interface SelfAPISuccess<T> {
    success: true
    response: T
}

interface SelfAPIError {
    success: false
    message: string
}