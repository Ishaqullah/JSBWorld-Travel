import { useEffect } from 'react';

export default function GeneralConditions() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-center mb-6">
          <span className="text-gradient">General Conditions</span>
        </h1>
        <p className="text-lg text-gray-600 text-center mb-12">
          Please read these terms carefully before booking with JSBWORLD-TRAVEL.
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          
          {/* Introduction */}
          <section>
            <p className="text-gray-700 mb-4">
              We are JSBWORLD-TRAVEL LLC. Throughout these booking terms, references to "we," "us," and "our" refer to JSBWORLD-TRAVEL LLC, while "you" and "your" refer to all individuals listed on the booking (including anyone added or substituted later).
            </p>
            <p className="text-gray-700 mb-4">
              JSBWORLD-TRAVEL LLC is located at 710 N Post Oak Rd STE 150, Houston, TX 77024.
            </p>
            <p className="text-gray-700 mb-4">
              These booking terms, along with any additional written information provided prior to confirming your booking, as well as the terms of our suppliers, establish the contract between you and us for the travel arrangements detailed on www.JSBWORLD-TRAVEL.com/us (referred to as "your arrangements"). Please read them carefully, as they outline our respective rights and responsibilities. By making a booking, you agree on behalf of yourself and those you represent to be bound by these terms. If you are booking on behalf of others, you agree to inform them of the applicable Terms & Conditions, including rules and restrictions. Please note that these terms include waivers of liability, class action waivers, and venue selection clauses.
            </p>
            <p className="text-gray-700 mb-4">
              You must be of legal age and possess the authority to act as the lead person on the booking. We will communicate only with the lead name on the booking for all matters.
            </p>
            <p className="text-gray-700 mb-4 bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <strong>Special Note:</strong> While we strive to ensure the accuracy of all information and pricing on our website and in our materials, errors can occur. We reserve the right to correct them when necessary. Please verify all information, including pricing, before finalizing your booking.
            </p>
            <p className="text-gray-700">
              In these terms, a 'package' refers to a pre-arranged combination of at least two of the following components, sold at an inclusive price, covering a period of more than 24 hours or including overnight accommodation: (a) transport; (b) accommodation; (c) other tourist services essential to the travel experience.
            </p>
          </section>

          {/* 1. Validity */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">1. Validity</h2>
            <p className="text-gray-700 mb-4">
              These Terms and Conditions apply to bookings made from July 25th, 2022, onwards.
            </p>
            <p className="text-gray-700">
              For reservations made prior to that date, the relevant Terms and Conditions will apply. If a booking is rescheduled or credit is used, the Terms in effect at the time of the new booking confirmation will apply.
            </p>
          </section>

          {/* 2. Our Agreement */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">2. Our Agreement</h2>
            <p className="text-gray-700 mb-4">
              To book your holiday, you must follow the online booking process. Alternatively, our Customer Service team may assist you in completing the process. By submitting the booking (or agreeing to have it submitted on your behalf), you accept these terms for all individuals named in the booking. A binding contract is formed once we issue a confirmation. Please review all details, including personal information, before confirming your booking, as changes may not be possible later. For assistance, you can access your booking details in "My Account."
            </p>
            <p className="text-gray-700 mb-4">
              Services provided by third-party suppliers will be subject to their own terms and conditions, which are part of your agreement with us. Please note that we are not responsible for the insolvency or bankruptcy of suppliers.
            </p>
            <p className="text-gray-700">
              Travel is a personal experience, and individual preferences may vary. We are not liable for any descriptions, photographs, or representations made by third-party sales representatives or travel agents regarding any JSBWORLD-TRAVEL holiday or vacation.
            </p>
          </section>

          {/* 3. Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">3. Payment</h2>
            <p className="text-gray-700">
              Payment instructions will be provided at the time of booking. Typically, a deposit is required to reserve your spot, with the full balance due in installments. Bookings made within 30 days of departure must be paid in full at the time of booking. Failure to make payments on time may result in cancellation and cancellation fees will apply. If paying by credit card, you agree to abide by our cancellation policy and waive the right to a chargeback, except in cases of fraud. If a chargeback dispute arises, you will be responsible for any associated costs, including legal fees.
            </p>
          </section>

          {/* 4. Insurance */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">4. Insurance</h2>
            <p className="text-gray-700">
              We highly recommend that all travelers purchase comprehensive travel insurance. Some countries may require valid medical insurance for entry, and we are not liable for denied entry due to lack of insurance. Declining insurance could result in financial losses, and we will not be responsible for any such losses that might have been covered by adequate travel protection.
            </p>
          </section>

          {/* 5. Special Requests */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">5. Special Requests</h2>
            <p className="text-gray-700">
              If you have any special requests, please inform us at the time of booking and confirm them in writing. We will do our best to accommodate reasonable requests but cannot guarantee fulfillment. Special requests noted on your booking confirmation are not binding, and failure to meet a request will not constitute a breach of contract.
            </p>
          </section>

          {/* 6. Disabilities and Medical Conditions */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">6. Disabilities and Medical Conditions</h2>
            <p className="text-gray-700">
              If you or any member of your party has a medical condition or disability that may affect your trip, please provide full details before booking so we can advise you accordingly. If we are unable to accommodate your needs, we reserve the right to decline or cancel your booking.
            </p>
          </section>

          {/* 7. Pricing */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">7. Pricing</h2>
            <p className="text-gray-700">
              The price of your arrangements is based on the services and dates you select, and it is your responsibility to review what is included or excluded before booking. Local taxes or fees may apply in some countries, and we reserve the right to adjust prices of unsold holidays at any time. A non-refundable handling fee of $25 USD will be charged separately.
            </p>
          </section>

          {/* 8. Cancellation Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">8. Cancellation Policy</h2>
            <p className="text-gray-700 mb-4">
              Partial cancellations of a booking are not permitted. If the customer wishes to cancel the entire booking, the cancellation policy outlined in this section will apply. JSBWORLD-TRAVEL incurs various non-refundable costs before a cancellation is processed, and as such, the associated penalties reflect these non-recoverable expenses. In case of cancellation, JSBWORLD-TRAVEL reserves the right to charge the applicable penalty as well as any costs or expenses incurred.
            </p>
            <p className="text-gray-700 mb-4">
              Please note that any products or services added to the trip after the initial booking date cannot be canceled within 60 days of the trip's departure. Any cancellations of these added services made less than 60 days before the departure date will incur a penalty of 100% of the cost of the canceled service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">8.1 Cancellation by the Customer</h3>
            <p className="text-gray-700 mb-4">
              Once any partial or full payment has been made, cancellations will only be accepted in writing. If you wish to cancel your reservation, you must submit your request via our contact form.
            </p>
            <p className="text-gray-700 mb-4">
              Your cancellation request will only be processed once it is received in writing. If received outside our Customer Service team's operating hours, the request will be processed starting the next business day.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>For cancellations made 60 days or more before the departure date, 60% of the total booking amount will be charged as a penalty.</li>
              <li>For cancellations made 59 days or fewer before the departure date, 75% of the total booking amount will be charged as a penalty.</li>
            </ul>
            <p className="text-gray-700">
              These penalties, along with any applicable management fees, will be deducted from any payments received by JSBWORLD-TRAVEL. Please note that any handling fees paid are non-refundable in the event of cancellation.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">8.2 Cancellation by JSBWORLD-TRAVEL</h3>
            <p className="text-gray-700 mb-4">JSBWORLD-TRAVEL reserves the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>Change the departure or return date of the trip</li>
              <li>Modify any non-essential aspect of the trip</li>
              <li>Cancel or adjust the trip, routes, or objectives set forth in the itinerary</li>
              <li>Cancel the trip if the minimum number of participants required to operate the trip is not met</li>
            </ul>
            <p className="text-gray-700 mb-4">
              If any such changes, modifications, cancellations, postponements, or delays occur, you acknowledge that no cash refund (whether in whole or part) will be provided, nor will you be entitled to claim compensation for any injury, loss, damage, or additional expenses incurred as a result of these changes.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-gray-700">
                <strong>Special Note on COVID-19:</strong> If the destination country requires a PCR test or other travel prerequisites, the related costs will be the client's responsibility, as well as ensuring that these requirements are met within the required time frame. If a client develops COVID-19 symptoms after the trip has commenced, leading to changes in the contracted services, any extra costs incurred will be the client's responsibility and should be claimed from their insurer.
              </p>
            </div>
          </section>

          {/* 9. Cancellation Coverage */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">9. Cancellation Coverage</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">9.1 Standard Coverage Included</h3>
            
            <h4 className="text-lg font-medium text-gray-700 mb-2">COVID-19 Contagion Protection:</h4>
            <p className="text-gray-700 mb-4">
              All reservations are safeguarded in case the Client is infected with COVID-19 before the trip's departure or if border/airspace closures occur due to COVID-19 at the destination. In such cases, JSBWORLD-TRAVEL will refund the full trip amount in the form of travel credit without penalties or fees, subject to the following conditions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
              <li>The infection must have affected the Client or another confirmed passenger on the reservation.</li>
              <li>A valid medical certificate and positive test result from an official, recognized health authority must be submitted.</li>
              <li>The infection must have occurred within seven (7) days before the trip departure.</li>
            </ul>

            <h4 className="text-lg font-medium text-gray-700 mb-2 mt-4">Border and/or Airspace Closure Protection:</h4>
            <p className="text-gray-700 mb-4">
              In case the Client is unable to travel due to COVID-19-related issues such as border closure, government restrictions, mandatory quarantine, or non-operational airlines, they can reschedule the trip for free using JSBWORLD-TRAVEL travel credit without incurring penalties or fees.
            </p>
            <p className="text-gray-700 mb-4">
              JSBWORLD-TRAVEL travel credit is a non-refundable virtual voucher that can be used for any trip available on our website. It does not expire.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">9.2 Optional Coverage for Unforeseen Events</h3>
            
            <h4 className="text-lg font-medium text-gray-700 mb-2">Flex Coverage:</h4>
            <p className="text-gray-700 mb-4">
              With "Flex" coverage, Clients may cancel their trip up to thirty (30) days before the departure date and receive a refund in travel credit. Cancellations after this period will be subject to the cancellation policy and associated fees.
            </p>

            <h4 className="text-lg font-medium text-gray-700 mb-2">Flex + Coverage ("Flex Plus"):</h4>
            <p className="text-gray-700">
              With "Flex Plus" coverage, the Client may cancel their trip up to thirty (30) days before the departure date for any reason. The Client can choose between receiving a refund in travel credit or cash.
            </p>
          </section>

          {/* 10. Changes */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">10. Changes</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">10.1 Changes by the Customer</h3>
            <p className="text-gray-700 mb-4">
              If you need to change your booking after it has been confirmed, you must notify us in writing via our website's "Contact Us" form. We will try our best to assist with changes, but they cannot be guaranteed. Any changes made will require payment of applicable fees or rate differences.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-4">10.2 Changes by JSBWORLD-TRAVEL</h3>
            <p className="text-gray-700 mb-4">
              Given the advance planning required for trips, we may need to make changes. Minor changes will be communicated as soon as possible.
            </p>
            <p className="text-gray-700 mb-2"><strong>Minor changes include:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
              <li>Alterations to the trip's duration of 12 hours or less.</li>
              <li>A change in accommodation of the same standard.</li>
            </ul>
            <p className="text-gray-700 mb-2"><strong>Major changes include:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
              <li>Significant changes to accommodation location or quality.</li>
              <li>Trip duration changes of more than 12 hours.</li>
              <li>Major itinerary changes or the cancellation of the trip.</li>
            </ul>
            <p className="text-gray-700">
              In case of major changes or cancellations, you will be notified as soon as possible and offered options including accepting the modified trip, receiving a refund in travel credit, or accepting alternative arrangements.
            </p>
          </section>

          {/* 11. Complaints */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">11. Complaints</h2>
            <p className="text-gray-700">
              Should any issues arise during your trip, promptly inform the relevant supplier to allow them to resolve the matter. You may also contact us via the "Contact Us" form on our website or our emergency line. If unresolved and you wish to escalate the issue, send us a formal written complaint within 28 days after your trip ends, including your booking reference and other relevant details.
            </p>
          </section>

          {/* 12. Your Behavior */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">12. Your Behavior</h2>
            <p className="text-gray-700">
              We reserve the right to terminate your arrangements immediately if you, in our opinion or that of any authority figure, behave in a manner that causes or threatens to cause distress, danger, damage, or inconvenience to others or property, or disrupts transport. In such cases, our responsibilities will end, and you must leave the accommodation or service immediately. We will not be liable for additional costs, losses, or obligations.
            </p>
          </section>

          {/* 13. Our Responsibilities */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">13. Our Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              We accept responsibility as the organizer under the U.S. Package Travel Regulations. If we or our suppliers fail to properly perform or arrange your confirmed services, we will compensate you reasonably.
            </p>
            <p className="text-gray-700 mb-2">We will not be liable for injury, illness, death, loss, damage, or other claims resulting from:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
              <li>Your actions or omissions.</li>
              <li>A third party's unforeseeable or unavoidable actions unrelated to our services.</li>
              <li>Unusual or unforeseeable circumstances beyond our control.</li>
              <li>Events beyond our foresight or control.</li>
            </ul>
            <p className="text-gray-700">
              JSBWORLD-TRAVEL is responsible for supplying services and accommodations as described for your booked trip, except when delays or external factors beyond our control prevent us from doing so.
            </p>
          </section>

          {/* 14. Jurisdiction and Applicable Law */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">14. Jurisdiction and Applicable Law</h2>
            <p className="text-gray-700 mb-4">
              These booking conditions are governed by New York law. Both parties agree that any disputes arising from this contract will be handled by a court of competent jurisdiction in New York.
            </p>
            <p className="text-gray-700">
              You agree to bring claims against us only in an individual capacity, not as part of a class action. We are not liable for punitive damages, and you must provide written notice of any claim within 30 days after your trip or its cancellation.
            </p>
          </section>

          {/* 15. Passport, Visa, and Health Requirements */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">15. Passport, Visa, and Health Requirements</h2>
            <p className="text-gray-700 mb-4">
              It is your responsibility to ensure that you meet all passport, visa, health, and immigration requirements for your travel itinerary. Requirements may change, so it's essential to confirm them well in advance of your departure. Many countries now mandate that passports remain valid for at least six months after your return date.
            </p>
            <p className="text-gray-700 mb-4">
              We are not liable if you are unable to travel or incur any losses due to your failure to comply with passport, visa, or health requirements.
            </p>
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 mb-4">
              <p className="text-gray-700">
                <strong>Passport and Vaccination Notice:</strong> For both domestic and international trips, you are responsible for verifying the entry, passport validity, and vaccination requirements for each destination and stopover.
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <p className="text-gray-700">
                <strong>COVID-19 Notice:</strong> By traveling, you accept the inherent risk of contracting COVID-19 and any associated consequences. You agree to release JSBWORLD-TRAVEL, its employees, and affiliated parties from any liability related to cancellations, changes, illness, or other losses related to COVID-19.
              </p>
            </div>
          </section>

          {/* 16. Flights */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">16. Flights</h2>
            <p className="text-gray-700 mb-4">
              Flight times provided at booking are for general reference only and are subject to change. The final flight times will be those shown on your e-tickets. It is your responsibility to verify the flight times on your ticket immediately upon receipt.
            </p>
            <p className="text-gray-700 mb-4">
              We cannot always confirm the airline, aircraft type, or airport that will be used for your flight. Minors must be accompanied by an adult, and we do not arrange travel for unaccompanied minors.
            </p>
            <p className="text-gray-700 mb-4">
              Airlines are solely responsible for changes in schedules, routes, delays, and cancellations. JSBWORLD-TRAVEL is not liable for these changes, cancellations, or delays.
            </p>
            <p className="text-gray-700">
              Once issued, e-tickets are non-refundable. You must confirm your flight details within 48 hours of departure directly with the airline.
            </p>
          </section>

          {/* 17. Miscellaneous */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">17. Miscellaneous</h2>
            <p className="text-gray-700 mb-4">
              Security concerns are a global issue, and circumstances can change rapidly. Due to international events or governmental travel advisories, accommodations, itineraries, or entire trips may need to be adjusted or canceled.
            </p>
            <p className="text-gray-700 mb-4">
              We strongly recommend that all travelers purchase comprehensive travel insurance. In the event of a computer or human billing error, we reserve the right to issue a corrected invoice.
            </p>
            <p className="text-gray-700">
              If you choose to avoid a destination due to governmental laws, regulations, or requirements, any associated costs or cancellation fees are your responsibility.
            </p>
          </section>

          {/* 18. Best Price Guarantee */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">18. Best Price Guarantee Terms and Conditions</h2>
            <p className="text-gray-700 mb-4">
              The Best Price Guarantee program begins on May 15, 2024, and applies only to bookings made after this date. JSBWORLD-TRAVEL reserves the right to modify or discontinue the program at its discretion without notice or liability.
            </p>
            <p className="text-gray-700 mb-4">
              To qualify, you must have a confirmed JSBWORLD-TRAVEL booking. If a lower rate is found for a qualifying booking, the difference will be credited to your account as a non-refundable wallet credit.
            </p>
            <p className="text-gray-700 mb-4">
              You may submit a Best Price Guarantee claim up to 11:59 p.m. local time, three (3) days before your trip. Claims must be made online, supported by valid documentation such as screenshots.
            </p>
            <p className="text-gray-700">
              The guarantee only applies to identical travel packages (same property, room type, flight, airline, dates, and other details). Price differences will be refunded as non-refundable wallet credits, not cash.
            </p>
          </section>

          {/* 19. Refer a Friend Program */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">19. Refer a Friend Program</h2>
            <p className="text-gray-700 mb-4">
              Participants must be 18 years or older, and referral credits are non-refundable. Credits are valid for 24 months from the date earned, and the referred friend must be a new customer.
            </p>
            <p className="text-gray-700">
              Referred friends must use the referrer's code during their first booking and may not share a room with the referrer. Referral codes are non-transferable and cannot be exchanged or altered.
            </p>
          </section>

          {/* 20. Special Giveaway */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">20. Special Giveaway</h2>
            <p className="text-gray-700 mb-4">
              To participate, entrants must submit a valid email. Each user is allowed one entry, and duplicate submissions may result in disqualification. One winner and a backup will be selected at random.
            </p>
            <p className="text-gray-700">
              The prize is non-transferable, non-exchangeable for cash, and subject to current tax regulations. JSBWORLD-TRAVEL reserves the right to publish the winner's name and photo on its website and social media channels.
            </p>
          </section>

          {/* 21. Newsletter Discount */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">21. $200 Off for Selected New Newsletter Subscribers</h2>
            <p className="text-gray-700">
              This discount applies only to your first reservation and is available exclusively to selected new newsletter subscribers. The voucher is valid for 90 days from the date you receive the email containing the voucher. It applies to bookings of any value but is limited to one discount per reservation. The discount cannot be combined with other promotions or discounts of a similar nature and is only applicable to the first payment on new bookings.
            </p>
          </section>

          {/* 22. Rewards Program */}
          <section>
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">22. JSBWORLD-TRAVEL Rewards Program Terms and Conditions</h2>
            <p className="text-gray-700 mb-4">
              Enrollment in the JSBWORLD-TRAVEL rewards program is free and automatic when you subscribe to the newsletter, create an account, or book your first tour. The program includes three levels: Silver, Gold, and Platinum based on the number of completed bookings.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Silver Level</h3>
            <p className="text-gray-700 mb-2"><strong>Requirements:</strong> No bookings required. JSBWORLD-TRAVEL subscription only.</p>
            <p className="text-gray-700 mb-4"><strong>Benefits:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
              <li>$200 Discount on First Booking (valid for 90 days)</li>
              <li>Exclusive Deals: Priority access to promotions via newsletter</li>
              <li>Free 24-Hour Price Lock</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Gold Level</h3>
            <p className="text-gray-700 mb-2"><strong>Requirements:</strong> At least 5 completed bookings.</p>
            <p className="text-gray-700 mb-4"><strong>Benefits (includes all Silver benefits):</strong></p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
              <li>Priority Access to New Trips</li>
              <li>$1,000 Travel Credit (valid for 12 months)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Platinum Level</h3>
            <p className="text-gray-700 mb-2"><strong>Requirements:</strong> At least 10 completed bookings.</p>
            <p className="text-gray-700 mb-4"><strong>Benefits (includes all Gold benefits):</strong></p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
              <li>Priority Access to New Trips</li>
              <li>$2,000 Travel Credit (valid for 12 months)</li>
            </ul>

            <p className="text-gray-700">
              JSBWORLD-TRAVEL reserves the right to revoke travel credits in cases of non-payment or fraudulent use. All interpretations of these Terms and Conditions shall be made solely at the discretion of JSBWORLD-TRAVEL.
            </p>
          </section>

          {/* Contact Information */}
          <section className="border-t pt-8 mt-8">
            <h2 className="text-2xl font-semibold text-primary-600 mb-4">Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about these General Conditions, please contact us at:{' '}
              <a href="mailto:info@jsbworld-travel.com" className="text-secondary-500 hover:underline">
                info@jsbworld-travel.com
              </a>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
