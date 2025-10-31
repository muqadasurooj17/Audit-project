// dummyData.js
const dummyData = {
    // ----------- KITCHEN -----------
    ADDR_55: {
      anchor_entity_type: "KITCHEN",
      anchor_entity_id: "KIT_123",
      subject_entity_type: "KITCHEN_ADDRESS",
      subject_entity_id: "ADDR_55",
      action_code: "kitchen_address.draft.update",
      data: { diff: { line2: { from: null, to: "Al Barsha 1" } } }
    },
    ADDR_56: {
      anchor_entity_type: "KITCHEN",
      anchor_entity_id: "KIT_124",
      subject_entity_type: "KITCHEN_ADDRESS",
      subject_entity_id: "ADDR_56",
      action_code: "kitchen_address.draft.update",
      data: { diff: { line2: { from: "Old Market", to: "Business Bay" } } }
    },
    ADDR_57: {
      anchor_entity_type: "KITCHEN",
      anchor_entity_id: "KIT_125",
      subject_entity_type: "KITCHEN_ADDRESS",
      subject_entity_id: "ADDR_57",
      action_code: "kitchen_address.draft.update",
      data: { diff: { line2: { from: "Downtown", to: "Palm Jumeirah" } } }
    },
    ADDR_58: {
      anchor_entity_type: "KITCHEN",
      anchor_entity_id: "KIT_126",
      subject_entity_type: "KITCHEN_ADDRESS",
      subject_entity_id: "ADDR_58",
      action_code: "kitchen_address.draft.update",
      data: { diff: { line2: { from: "JLT", to: "Dubai Marina" } } }
    },
    ADDR_59: {
      anchor_entity_type: "KITCHEN",
      anchor_entity_id: "KIT_127",
      subject_entity_type: "KITCHEN_ADDRESS",
      subject_entity_id: "ADDR_59",
      action_code: "kitchen_address.draft.update",
      data: { diff: { line2: { from: "Bur Dubai", to: "Deira City Center" } } }
    },
  
    // ----------- ORDER -----------
    OI_9931: {
      anchor_entity_type: "ORDER",
      anchor_entity_id: "ORD_4111",
      subject_entity_type: "ORDER_ITEM",
      subject_entity_id: "OI_9931",
      related_anchors: [
        { type: "KITCHEN", id: "KIT_123" },
        { type: "USER", id: "USR_88" }
      ],
      action_code: "order.item.update",
      data: { diff: { quantity: { from: 1, to: 2 } } }
    },
    OI_9932: {
      anchor_entity_type: "ORDER",
      anchor_entity_id: "ORD_4222",
      subject_entity_type: "ORDER_ITEM",
      subject_entity_id: "OI_9932",
      related_anchors: [
        { type: "KITCHEN", id: "KIT_123" },
        { type: "USER", id: "USR_88" }
      ],
      action_code: "order.item.update",
      data: { diff: { quantity: { from: 1, to: 2 } } }
    },
    OI_9933: {
      anchor_entity_type: "ORDER",
      anchor_entity_id: "ORD_4821",
      subject_entity_type: "ORDER_ITEM",
      subject_entity_id: "OI_9933",
      related_anchors: [
        { type: "KITCHEN", id: "KIT_123" },
        { type: "USER", id: "USR_88" }
      ],
      action_code: "order.item.update",
      data: { diff: { quantity: { from: 1, to: 2 } } }
    },
    OI_9934: {
      anchor_entity_type: "ORDER",
      anchor_entity_id: "ORD_4822",
      subject_entity_type: "ORDER_ITEM",
      subject_entity_id: "OI_9934",
      related_anchors: [{ type: "KITCHEN", id: "KIT_124" }],
      action_code: "order.item.cancel",
      data: { diff: { status: { from: "PLACED", to: "CANCELLED" } } }
    },
    OI_9935: {
      anchor_entity_type: "ORDER",
      anchor_entity_id: "ORD_4823",
      subject_entity_type: "ORDER_ITEM",
      subject_entity_id: "OI_9935",
      related_anchors: [{ type: "KITCHEN", id: "KIT_125" }],
      action_code: "order.item.create",
      data: { diff: { quantity: { from: 0, to: 3 } } }
    },
    OI_9936: {
      anchor_entity_type: "ORDER",
      anchor_entity_id: "ORD_4824",
      subject_entity_type: "ORDER_ITEM",
      subject_entity_id: "OI_9936",
      related_anchors: [{ type: "KITCHEN", id: "KIT_125" }],
      action_code: "order.item.create",
      data: { diff: { quantity: { from: 0, to: 3 } } }
    },
    OI_9937: {
      anchor_entity_type: "ORDER",
      anchor_entity_id: "ORD_4825",
      subject_entity_type: "ORDER_ITEM",
      subject_entity_id: "OI_9937",
      related_anchors: [{ type: "KITCHEN", id: "KIT_125" }],
      action_code: "order.item.create",
      data: { diff: { quantity: { from: 0, to: 3 } } }
    },
    OI_9938: {
      anchor_entity_type: "ORDER",
      anchor_entity_id: "ORD_4826",
      subject_entity_type: "ORDER_ITEM",
      subject_entity_id: "OI_9938",
      related_anchors: [{ type: "KITCHEN", id: "KIT_125" }],
      action_code: "order.item.create",
      data: { diff: { quantity: { from: 0, to: 3 } } }
    },
    OI_9939: {
      anchor_entity_type: "ORDER",
      anchor_entity_id: "ORD_4829",
      subject_entity_type: "ORDER_ITEM",
      subject_entity_id: "OI_9939",
      related_anchors: [{ type: "KITCHEN", id: "KIT_125" }],
      action_code: "order.item.create",
      data: { diff: { quantity: { from: 0, to: 3 } } }
    },
    OI_9940: {
      anchor_entity_type: "ORDER",
      anchor_entity_id: "ORD_4849",
      subject_entity_type: "ORDER_ITEM",
      subject_entity_id: "OI_9940",
      related_anchors: [{ type: "KITCHEN", id: "KIT_125" }],
      action_code: "order.item.create",
      data: { diff: { quantity: { from: 0, to: 3 } } }
    },
  
    // ----------- DISCOUNT -----------
    DP_9901: {
      anchor_entity_type: "DISCOUNT",
      anchor_entity_id: "DISC_77",
      subject_entity_type: "DISCOUNT_PARTICIPATION",
      subject_entity_id: "DP_9901",
      related_anchors: [{ type: "KITCHEN", id: "KIT_123" }],
      action_code: "discount.participation.approve",
      data: { diff: { status: { from: "PENDING", to: "APPROVED" } } }
    },
    DP_9902: {
      anchor_entity_type: "DISCOUNT",
      anchor_entity_id: "DISC_78",
      subject_entity_type: "DISCOUNT_PARTICIPATION",
      subject_entity_id: "DP_9902",
      related_anchors: [{ type: "KITCHEN", id: "KIT_124" }],
      action_code: "discount.participation.reject",
      data: { diff: { status: { from: "PENDING", to: "REJECTED" } } }
    },
  
    // ----------- FEEDBACK -----------
    FB_991: {
      anchor_entity_type: "FEEDBACK",
      anchor_entity_id: "FB_991",
      subject_entity_type: "FEEDBACK",
      subject_entity_id: "FB_991",
      related_anchors: [{ type: "ORDER", id: "ORD_220" }],
      action_code: "feedback.resolve",
      data: { diff: { status: { from: "OPEN", to: "RESOLVED" } } }
    },
    FB_992: {
      anchor_entity_type: "FEEDBACK",
      anchor_entity_id: "FB_992",
      subject_entity_type: "FEEDBACK",
      subject_entity_id: "FB_992",
      related_anchors: [{ type: "ORDER", id: "ORD_221" }],
      action_code: "feedback.create",
      data: { diff: { message: { from: null, to: "Customer satisfied" } } }
    }
  };
  
  export default dummyData;
  