export function dlDoc(content, filename) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

const date  = () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
const ref   = () => `CREB-${Date.now()}`;
export const fmt = n => n != null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n) : '—';

// ── 1. CANNABIS PROPERTY NDA ─────────────────────────────────────────────────
export function genNDA({ user, property }) {
  return `CANNABIS PROPERTY NON-DISCLOSURE AGREEMENT

Date: ${date()}
Reference: ${ref()}

DISCLOSING PARTY (Broker / Owner):
  Brokerage:  ${property.brokerName}
  License:    ${property.brokerLicense || '[RE License No.]'}
  Email:      ${property.brokerEmail || '[Broker Email]'}

RECEIVING PARTY (Prospective Tenant / Buyer):
  Name:       ${user.firstName} ${user.lastName}
  Company:    ${user.businessName || '[Business Name]'}
  Email:      ${user.email}

PROPERTY:
  Address:    ${property.address || '[Address]'}, ${property.city}, ${property.state}
  Type:       ${property.propertyType}
  Deal Type:  ${property.dealType}
  Listing:    ${property.id}

─────────────────────────────────────────────────────────
1. PURPOSE
This Agreement governs the disclosure of confidential information shared in connection with the Receiving Party's evaluation of a potential lease, purchase, or development arrangement for the above-referenced cannabis-compliant property.

2. CONFIDENTIAL INFORMATION
"Confidential Information" includes: financial statements, rent rolls, NOI and cap rate analysis, tenant information, environmental reports, zoning approvals and CUP status, cannabis license status of any current occupant, landlord identity and contact information, offer terms, and any proprietary operational or financial data disclosed by the Disclosing Party.

3. RECEIVING PARTY OBLIGATIONS
  (a) Hold all Confidential Information in strict confidence;
  (b) Not disclose to any third party without prior written consent;
  (c) Use information solely to evaluate the potential transaction described herein;
  (d) Limit disclosure to authorized representatives with a legitimate need to know;
  (e) Promptly notify the Disclosing Party of any unauthorized disclosure.

4. CANNABIS-SPECIFIC PROVISIONS
  (a) The property is being evaluated for cannabis operations lawful under ${property.state} state law;
  (b) The Receiving Party agrees not to disclose any Confidential Information to federal agencies in ways that could harm the Disclosing Party's interests;
  (c) Neither party shall use this Agreement to facilitate interference with any existing cannabis license.

5. TERM
Two (2) years from the date of execution.

6. GOVERNING LAW
State of ${property.state}.

RECEIVING PARTY:
Signature: _________________________________
Name: ${user.firstName} ${user.lastName}
Date: _____________________

DISCLOSING PARTY / BROKER:
Signature: _________________________________
Name: ${property.brokerName}
Date: _____________________

Ref: ${ref()} — Cannabis Real Estate Brokers Platform
`;
}

// ── 2. LETTER OF INTENT ──────────────────────────────────────────────────────
export function genLOI({ user, property, offerData }) {
  const { dealType, offerPrice, monthlyRent, leaseYears, message } = offerData;
  const isLease    = dealType === 'lease' || dealType === 'sale_leaseback';
  const isPurchase = dealType === 'purchase' || dealType === 'sale_leaseback' || dealType === 'land';

  return `LETTER OF INTENT
Cannabis Commercial Real Estate

Date: ${date()}
Reference: ${ref()}

TO:   ${property.brokerName}
      Re: ${property.address || '[Address]'}, ${property.city}, ${property.state}
          ${property.propertyType} — CREB Listing ${property.id}

FROM: ${user.firstName} ${user.lastName}${user.businessName ? ' / ' + user.businessName : ''}
      ${user.email}

This non-binding Letter of Intent sets forth the principal terms under which the undersigned Prospective ${isLease ? 'Tenant' : 'Buyer'} proposes to ${isLease ? 'lease' : 'acquire'} the above-referenced property.

PROPOSED TERMS:

  Deal Type:          ${dealType === 'lease' ? 'Commercial Lease' : dealType === 'purchase' ? 'Purchase & Sale' : dealType === 'sale_leaseback' ? 'Sale-Leaseback' : 'Land / Development Purchase'}
  ${isPurchase ? `Purchase Price:     ${fmt(offerPrice)}
  Earnest Money (3%): ${fmt(offerPrice * 0.03)} — due within 5 business days of PSA execution` : ''}
  ${isLease ? `Monthly Rent:       ${fmt(monthlyRent)}
  Lease Term:         ${leaseYears} year(s)
  Security Deposit:   ${fmt(monthlyRent * 2)} (2 months)
  Free Rent:          To be negotiated` : ''}
  Due Diligence:      30 days from execution
  Zoning Confirm:     Buyer/Tenant to verify cannabis zoning within DD period
  Cannabis Use:       Property to be used for ${property.propertyType} — lawful under ${property.state} law
  ${property.existingLicense ? `Existing License:   Parties to address existing license in definitive agreement` : ''}

CONTINGENCIES:
  (a) Satisfactory due diligence including environmental, zoning, and title review
  (b) Confirmation of cannabis zoning and local permitting eligibility
  (c) ${isPurchase ? 'Clear and marketable title' : 'Execution of Cannabis Use Addendum acceptable to both parties'}
  (d) ${isPurchase ? 'Financing commitment (if applicable)' : 'Landlord consent to cannabis operations'}
  (e) Prospective ${isLease ? 'Tenant' : 'Buyer'} obtaining all required state and local cannabis licenses

EXCLUSIVITY:
Upon countersignature, parties agree to negotiate exclusively for 30 days.

PLATFORM FEE:
2% of ${isPurchase ? 'purchase price' : 'first year rent'} (${fmt((isPurchase ? offerPrice : monthlyRent * 12) * 0.02)}) payable by ${isLease ? 'Landlord/Owner' : 'Seller'} at closing to Cannabis Real Estate Brokers.

NON-BINDING: This LOI is non-binding except for Exclusivity and Confidentiality provisions.

${message ? `NOTES FROM ${isLease ? 'PROSPECTIVE TENANT' : 'PROSPECTIVE BUYER'}:\n${message}\n` : ''}

${user.firstName} ${user.lastName}
${user.businessName || ''}
${user.email}
Date: _____________________

ACCEPTED BY BROKER / OWNER:
Signature: _________________________________
Date: _____________________
`;
}

// ── 3. COMMERCIAL LEASE + CANNABIS ADDENDUM ──────────────────────────────────
export function genLease({ user, property, offerData }) {
  const { monthlyRent, leaseYears } = offerData;
  return `COMMERCIAL LEASE AGREEMENT
WITH CANNABIS USE ADDENDUM

Date: ${date()}
Reference: ${ref()}

LANDLORD: ${property.brokerName} / Property Owner
TENANT:   ${user.firstName} ${user.lastName}${user.businessName ? ' / ' + user.businessName : ''}

PREMISES:
  Address:    ${property.address || '[Address]'}, ${property.city}, ${property.state}
  Size:       ${property.sqft ? property.sqft.toLocaleString() + ' sqft' : '[To be confirmed]'}
  Use:        ${property.propertyType} — Cannabis Operations

══════════════════════════════════════════
ARTICLE 1 — TERM

1.1 Lease Term: ${leaseYears} year(s) commencing on the Commencement Date.
1.2 Permitted Use: Cannabis operations as permitted under ${property.state} state law, specifically for use as a ${property.propertyType}.

══════════════════════════════════════════
ARTICLE 2 — RENT

2.1 Base Rent: ${fmt(monthlyRent)} per month.
2.2 Annual Escalation: 3% per year on each anniversary of the Commencement Date.
2.3 Security Deposit: ${fmt(monthlyRent * 2)} due at execution.
2.4 Late Fee: 5% of monthly rent if paid after the 5th of the month.

══════════════════════════════════════════
ARTICLE 3 — IMPROVEMENTS

3.1 Tenant may make cannabis-specific improvements with Landlord's prior written consent.
3.2 All improvements must comply with applicable building codes and cannabis regulations.
3.3 Tenant responsible for any specialized ventilation, security, or vault installation.

══════════════════════════════════════════
ARTICLE 4 — MAINTENANCE

4.1 Tenant maintains all interior systems, HVAC, and cannabis-specific infrastructure.
4.2 Landlord maintains structural elements, roof, and building exterior.
4.3 Tenant shall maintain odor mitigation at all times per state requirements.

══════════════════════════════════════════
ARTICLE 5 — INSURANCE

5.1 Tenant shall carry: (a) Commercial General Liability — $2M per occurrence; (b) Cannabis Business Insurance — minimum $1M; (c) Property coverage for Tenant's improvements and inventory.
5.2 Landlord named as additional insured on all policies.

══════════════════════════════════════════
CANNABIS USE ADDENDUM
(Incorporated into and made part of the Lease)

CA-1. AUTHORIZATION. Landlord authorizes Tenant to operate a licensed cannabis business at the Premises subject to this Addendum.

CA-2. LICENSE REQUIREMENT. Tenant must obtain and maintain all required state and local cannabis licenses. Copies to Landlord within 5 business days of issuance or renewal. License suspension or revocation is a material breach of this Lease.

CA-3. ODOR & WASTE. Tenant shall install adequate odor mitigation. Cannabis waste disposed per state regulations only — not in standard trash or sewer.

CA-4. SECURITY. State-mandated security systems required at all times. Tenant provides Landlord 24-hour emergency security contact.

CA-5. CASH. Tenant shall maintain on-premises vault or safe meeting state requirements. Landlord acknowledges cannabis operations may involve significant cash.

CA-6. FEDERAL LAW. Tenant acknowledges cannabis may violate federal law. Landlord shall not be liable for federal enforcement against Tenant. Tenant indemnifies Landlord from federal claims arising from cannabis operations.

CA-7. BANKING. Tenant shall demonstrate cannabis-compliant banking within 30 days of Commencement Date.

CA-8. LANDLORD COOPERATION. Landlord agrees to execute required landlord consent forms for state licensing within 10 business days of written request.

CA-9. CHANGE IN LAW. If cannabis operations become unlawful in ${property.state}, either party may terminate on 90 days' written notice without penalty.

CA-10. PLATFORM FEE. Landlord acknowledges a platform facilitation fee of 2% of Year 1 rent (${fmt(monthlyRent * 12 * 0.02)}) is payable to Cannabis Real Estate Brokers at Commencement.

LANDLORD:
Signature: _________________________________
Date: _____________________

TENANT:
Signature: _________________________________
Name: ${user.firstName} ${user.lastName}
Date: _____________________

Ref: ${ref()} — Cannabis Real Estate Brokers
`;
}

// ── 4. PURCHASE & SALE AGREEMENT ─────────────────────────────────────────────
export function genPSA({ user, property, offerData }) {
  const { offerPrice, dealType } = offerData;
  const isLand = dealType === 'land';

  return `CANNABIS PROPERTY PURCHASE AND SALE AGREEMENT

Date: ${date()}
Reference: ${ref()}

SELLER:  ${property.brokerName} / Property Owner
BUYER:   ${user.firstName} ${user.lastName}${user.businessName ? ' / ' + user.businessName : ''}
         ${user.email}

PROPERTY:
  Address:  ${property.address || '[Address]'}, ${property.city}, ${property.state}
  County:   ${property.county || '[County]'}
  Type:     ${property.propertyType}
  Size:     ${property.sqft ? property.sqft.toLocaleString() + ' sqft' : '[To be confirmed]'}
  Zoning:   ${property.zoning || '[Zoning — to be verified]'}
  APN:      [Assessor Parcel Number — confirmed in title report]

══════════════════════════════════════════
ARTICLE 1 — PURCHASE PRICE

1.1 Purchase Price: ${fmt(offerPrice)}
1.2 Earnest Money: ${fmt(offerPrice * 0.03)} (3%) deposited into escrow within 5 business days of execution.
1.3 Balance: ${fmt(offerPrice * 0.97)} due at Closing via wire transfer.
${isLand ? '1.4 Development Note: Property sold as entitled/unentitled land. Buyer responsible for all development approvals and cannabis licensing.' : ''}

══════════════════════════════════════════
ARTICLE 2 — DUE DILIGENCE

2.1 Period: 30 days from execution.
2.2 Buyer shall review: title, survey, environmental Phase I/II, zoning confirmation, cannabis permitting eligibility, local ordinances, existing leases, and financial records.
2.3 Cannabis-Specific DD: Buyer confirms: (a) property eligible for cannabis use under current zoning; (b) required local permits obtainable; (c) no open environmental issues; (d) buffer zone compliance.
2.4 Termination Right: Buyer may terminate for any reason during DD period with full return of Earnest Money.

══════════════════════════════════════════
ARTICLE 3 — TITLE AND CLOSING

3.1 Seller conveys by General Warranty Deed, free of all liens except current-year taxes.
3.2 Closing Date: 45 days after expiration of DD period.
3.3 Closing costs split per local custom unless otherwise agreed.

══════════════════════════════════════════
ARTICLE 4 — SELLER REPRESENTATIONS

  (a) Good and marketable title;
  (b) No pending litigation affecting the property;
  (c) Cannabis zoning in good standing with no pending adverse changes;
  (d) No known environmental contamination beyond disclosed reports;
  (e) All taxes and assessments current;
  (f) No undisclosed easements or encumbrances.

══════════════════════════════════════════
ARTICLE 5 — CANNABIS PROVISIONS

5.1 Buyer acknowledges cannabis operations may violate federal law. Seller makes no representation regarding federal permissibility.
5.2 Buyer is solely responsible for obtaining all required state and local cannabis licenses.
5.3 Seller shall cooperate with any landlord consent forms required for Buyer's cannabis licensing.

══════════════════════════════════════════
ARTICLE 6 — PLATFORM FEE

Cannabis Real Estate Brokers platform fee: 2% of Purchase Price = ${fmt(offerPrice * 0.02)}, payable by Seller at Closing.

══════════════════════════════════════════
ARTICLE 7 — GENERAL

7.1 Governing Law: ${property.state}.
7.2 Disputes: Mediation then binding arbitration.
7.3 Counterparts / E-Signature: Permitted.

SELLER:
Signature: _________________________________
Date: _____________________

BUYER:
Signature: _________________________________
Name: ${user.firstName} ${user.lastName}
Date: _____________________

Ref: ${ref()} — Cannabis Real Estate Brokers
`;
}

// ── 5. SALE-LEASEBACK AGREEMENT ADDENDUM ────────────────────────────────────
export function genSaleLeaseback({ user, property, offerData }) {
  const { offerPrice, monthlyRent, leaseYears } = offerData;
  return `SALE-LEASEBACK AGREEMENT
Addendum to Purchase & Sale Agreement

Date: ${date()}
Reference: ${ref()}

SELLER / TENANT: ${user.firstName} ${user.lastName}${user.businessName ? ' / ' + user.businessName : ''}
BUYER / LANDLORD: ${property.brokerName} / Buyer (to be identified)

PROPERTY: ${property.address || '[Address]'}, ${property.city}, ${property.state}

This Sale-Leaseback Addendum is incorporated into and supplements the Purchase & Sale Agreement between the parties.

SALE TERMS:
  Purchase Price:     ${fmt(offerPrice)}
  Closing:            Per PSA terms

LEASEBACK TERMS:
  Monthly Rent:       ${fmt(monthlyRent)}
  Lease Term:         ${leaseYears} year(s) commencing at Closing
  Annual Escalation:  3% per year
  Security Deposit:   ${fmt(monthlyRent * 2)}
  Renewal Option:     ${leaseYears} additional year(s) at Tenant's option

CANNABIS PROVISIONS:
  Seller/Tenant shall maintain all required cannabis licenses throughout the leaseback term.
  Buyer/Landlord acknowledges the property will continue to be used for cannabis operations.
  Full Cannabis Use Addendum (attached) governs operations during leaseback period.

SELLER REPRESENTATIONS:
  (a) Cannabis license(s) in good standing at time of closing;
  (b) No pending license revocations or material compliance violations;
  (c) Seller has right to assign or transfer lease obligations as needed.

PLATFORM FEE: 2% of purchase price (${fmt(offerPrice * 0.02)}) payable by Seller at Closing.

SELLER / TENANT:
Signature: _________________________________
Date: _____________________

BUYER / LANDLORD:
Signature: _________________________________
Date: _____________________

Ref: ${ref()} — Cannabis Real Estate Brokers
`;
}
