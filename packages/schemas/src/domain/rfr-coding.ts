export const RfrCoding: Record<string, string | undefined> = {
  // PDS documented exit codes
  DEA: '[PDS] Death',
  EMB: '[PDS] Embarkation',
  SCT: '[PDS] Transferred to Scotland',
  NIT: '[PDS] Transferred to Northern Ireland',
  TRA: '[PDS] Temporary resident not returned',
  ORR: '[PDS] Other reason',

  // Exit codes not specified by the PDS FHIR aPI
  AFL: '[Undocumented] Armed forces enlistment (notified locally). Citizen has moved out for duty and notified by the person themselves',
  AFN: '[Undocumented] Armed forces enlistment (notified by armed forces). Citizen has moved out for duty and notified by someone else (e.g. armed forces doctor updating a system). ',
  CAN: '[Undocumented] Cancelled',
  CGA: "[Undocumented] Gone away and address not known / FP69. This is usually set because patient does not answer mail or has post returned as not known at this address. FP69 the building doesn't exist / letter returned. Royal mail has informed that it doesn't exist. ",
  DIS: '[Undocumented] Practice dissolution - The GP practice has been dissolved and patients have been released from the practice.',
  LDN: '[Undocumented] Logical deletion - Patient has request their record to be removed from PDS.',
  OPA: '[Undocumented] Address out of practice area. Patient has been removed because their address is outside of the effective area.',
  RDI: '[Undocumented] Practice request immediate removal. Someone at the practice (e.g. practice manager?) has requested that the patient be removed from the patient list of practice',
  RDR: '[Undocumented] Practice request. Someone at the practice (e.g. practice manager?) has requested that the patient be removed from the patient list of practice',
  RFI: '[Undocumented] Removal from residential institute. Patient has left a residential institute so no longer falls under the remit of the associated GP practice.',
  RPR: '[Undocumented] Patient request. Patient request to be removed from GP practice.',
  SDL: '[Undocumented] Services dependent (notified locally). A dependent (e.g. spouse/child) of citizen in armed forces who moves out on base. This individual notifies the GP in person.',
  SDN: '[Undocumented] Services dependent (notified locally). A dependent (e.g. spouse/child) of citizen in armed forces who moves out on base. Someone else updates the system, for instance the doctor in the armed forces will update it.',
};
