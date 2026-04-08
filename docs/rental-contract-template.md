# Rental Contract Template

**Document Type:** Rental / Lease Agreement  
**Version:** 1.0.0  
**Platform:** Rent App

---

> **Instructions for Use**  
> This is a template used by the system to auto-generate a binding rental agreement PDF when a rental request is approved. Variables enclosed in `{{ }}` are replaced by the system with actual values at generation time.

---

# RENTAL AGREEMENT

**Contract Number:** `{{ contract.id }}`  
**Date of Issue:** `{{ contract.createdAt | formatDate }}`

---

## PARTIES

**LESSOR (Owner / Platform Representative)**

| Field | Value |
|-------|-------|
| Name | Rent App Platform |
| Address | `{{ lessor.address }}` |
| Contact | `{{ lessor.contact }}` |

**LESSEE (Renter)**

| Field | Value |
|-------|-------|
| Full Name | `{{ renter.name }}` |
| Email | `{{ renter.email }}` |
| Phone | `{{ renter.phone }}` |
| ID / Passport No. | `{{ renter.identityNumber }}` |

---

## RENTAL PROPERTY

| Field | Details |
|-------|---------|
| Unit Name | `{{ unit.name }}` |
| Unit Type | `{{ unit.type }}` |
| Location / Address | `{{ unit.location }}` |
| Unit ID | `{{ unit.id }}` |

---

## RENTAL TERM

| Field | Details |
|-------|---------|
| Start Date | `{{ request.startDate | formatDate }}` |
| End Date | `{{ request.endDate | formatDate }}` |
| Duration | `{{ request.durationDays }}` day(s) |
| Number of Occupants | `{{ request.occupants }}` person(s) |
| Rental Purpose | `{{ request.purpose }}` |

---

## FINANCIAL TERMS

| Item | Amount |
|------|--------|
| Daily Rate | `{{ unit.pricePerDay | formatCurrency }}` |
| Total Rental Duration | `{{ request.durationDays }}` day(s) |
| **Total Rental Fee** | **`{{ contract.totalFee | formatCurrency }}`** |
| Payment Due Date | `{{ contract.paymentDueDate | formatDate }}` |
| Payment Method | As agreed separately |

> All amounts are in Indonesian Rupiah (IDR) unless otherwise specified.

---

## TERMS AND CONDITIONS

### 1. Occupancy

1.1 The Lessee may only occupy the Unit with the number of persons stated in this Agreement (`{{ request.occupants }}` person(s)). Any additional occupants must be approved in writing by the Lessor prior to arrival.

1.2 The Lessee agrees to occupy the Unit solely for the stated purpose of **`{{ request.purpose }}`** use, and agrees not to use the Unit for any illegal, hazardous, or unauthorized activities.

1.3 The Lessee shall take possession of the Unit no earlier than the Start Date and shall vacate the Unit no later than **23:59 on the End Date** specified above.

---

### 2. Payment Obligations

2.1 The Lessee agrees to pay the total rental fee of **`{{ contract.totalFee | formatCurrency }}`** in full by the Payment Due Date.

2.2 Late payment may result in a surcharge of **2% per day** of the outstanding amount, commencing on the day following the Payment Due Date.

2.3 Failure to pay within 7 days after the Payment Due Date shall entitle the Lessor to terminate this Agreement and reclaim the Unit, with no refund obligation.

---

### 3. Security Deposit

3.1 The Lessee shall pay a refundable security deposit of **`{{ contract.depositAmount | formatCurrency }}`** prior to occupancy.

3.2 The deposit will be returned within **14 business days** after the end of the rental period, provided no damage or breach of contract has occurred.

3.3 The Lessor reserves the right to deduct from the deposit any costs incurred due to:
  - Damage to the Unit or its contents beyond normal wear and tear
  - Unpaid rent or fees
  - Costs of cleaning if the Unit is not returned in a reasonably clean condition
  - Any other costs arising from the Lessee's breach of this Agreement

---

### 4. Lessee / Renter Responsibilities

> **This section explicitly defines the responsibilities and obligations of the Lessee. By signing this Agreement, the Lessee acknowledges and accepts all responsibilities listed below.**

4.1 **Care of Property**  
The Lessee shall maintain the Unit and all fixtures, furniture, appliances, and fittings in good and clean condition. The Lessee is responsible for all damage caused by negligence, misuse, or deliberate action by the Lessee or any person the Lessee permits in the Unit.

4.2 **Utilities and Services**  
Unless otherwise specified in a separate addendum, the Lessee is responsible for all utility costs incurred during the rental period, including but not limited to electricity, water, internet, and gas.

4.3 **Compliance with Rules**  
The Lessee shall comply with all house rules, building regulations, and community guidelines applicable to the Unit. Copies of any specific building rules are provided in the Unit or upon request.

4.4 **Noise and Disturbance**  
The Lessee shall not cause unreasonable noise or disturbance that interferes with the peaceful enjoyment of neighboring properties. Quiet hours are from **22:00 to 07:00** daily.

4.5 **Prohibited Activities**  
The Lessee shall not:
  - Sublet or assign the Unit to any third party without prior written consent
  - Keep pets in the Unit unless expressly permitted in writing
  - Smoke inside the Unit (if a no-smoking policy applies)
  - Make structural alterations or modifications to the Unit
  - Remove any furniture or fixtures from the Unit

4.6 **Reporting Damage**  
The Lessee shall promptly report any damage, defects, or maintenance issues to the Lessor within **24 hours** of discovery.

4.7 **Access for Inspection**  
The Lessee agrees to allow the Lessor or its authorized representative access to the Unit for inspection or maintenance purposes, with reasonable advance notice of at least **24 hours**, except in cases of emergency.

4.8 **Vacating the Unit**  
Upon termination or expiry of this Agreement, the Lessee shall:
  - Remove all personal belongings
  - Return all keys, access cards, and any other items provided at check-in
  - Leave the Unit in the same condition as received (normal wear and tear excepted)
  - Provide a forwarding address for return of any security deposit

4.9 **Liability for Third Parties**  
The Lessee is fully responsible for the conduct of all persons invited into or permitted to occupy the Unit during the rental period. The Lessee indemnifies the Lessor against any loss or damage caused by such persons.

---

### 5. Lessor Responsibilities

5.1 The Lessor warrants that the Unit is fit for the agreed purpose and is free from any undisclosed defects at the commencement of the rental period.

5.2 The Lessor shall carry out necessary repairs to structural elements, plumbing, and electrical systems within a reasonable time after being notified by the Lessee.

5.3 The Lessor shall respect the Lessee's right to quiet enjoyment of the Unit during the tenancy.

---

### 6. Termination

6.1 **By the Lessee:** The Lessee may terminate this Agreement before the End Date by providing **14 days' written notice**. Prepaid rent may be forfeited depending on the notice period.

6.2 **By the Lessor:** The Lessor may terminate this Agreement immediately and without notice if the Lessee:
  - Fails to pay rent when due (after a 7-day grace period)
  - Causes serious damage to the Unit
  - Engages in illegal activities on the premises
  - Materially breaches any clause of this Agreement

6.3 Upon termination, the Lessee must vacate the Unit within the time specified in the termination notice.

---

### 7. Indemnification and Limitation of Liability

7.1 The Lessee agrees to indemnify and hold the Lessor harmless from any claims, losses, or damages arising from the Lessee's use or misuse of the Unit.

7.2 The Lessor shall not be liable for any loss of or damage to the Lessee's personal property, except where caused by the Lessor's negligence.

7.3 The Lessor's total liability under this Agreement shall not exceed the total rental fee paid.

---

### 8. Dispute Resolution

8.1 The Parties agree to attempt to resolve any dispute arising from this Agreement through **good-faith negotiation** within 30 days of the dispute being raised.

8.2 If negotiation fails, disputes shall be submitted to **mediation** before resorting to litigation.

8.3 This Agreement is governed by and construed in accordance with the laws of the Republic of Indonesia.

---

### 9. Entire Agreement

9.1 This Agreement, together with any addenda attached hereto, constitutes the entire agreement between the Parties and supersedes all prior negotiations, understandings, and agreements.

9.2 Amendments to this Agreement are only valid if made in writing and signed by both Parties.

---

## SIGNATURES

By signing below, both Parties confirm that they have read, understood, and agreed to all terms and conditions of this Rental Agreement.

---

**LESSOR**

```
Name     : ________________________________
Title    : Authorized Representative, Rent App Platform
Date     : {{ contract.createdAt | formatDate }}
Signature: ________________________________
```

---

**LESSEE / RENTER**

```
Name     : {{ renter.name }}
ID No.   : {{ renter.identityNumber }}
Date     : {{ contract.signedAt | formatDate }}
Signature: ________________________________
           (Digital signature recorded by the platform)
IP Address: {{ contract.signerIpAddress }}
```

---

*This document was generated automatically by the Rent App platform on `{{ contract.createdAt | formatDateTime }}`. The digital signature recorded above constitutes a legally binding acceptance of all terms contained herein.*

*Contract ID: `{{ contract.id }}`*
