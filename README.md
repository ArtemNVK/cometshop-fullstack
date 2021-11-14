<p>CometShop is a MERN stack ecommerce web application. This application is built both for customers and admins. CometShop features admin panel that allows for creating products either updating them (including deleting), updating/deleting users, and deleting orders or marking them as delivered. </p>
<p><strong>NOTE</strong>: CometShop is accompanied by CometShop Mobile App. The actual web application shares the same backend with aforementioned mobile app. That is, they are in synch. Although, CometShop Mobile App has no admin panel implemented and uses Stripe for payment processing instead of PayPal that is being used by actual web application (however, both Stripe and PayPal endpoints are defined within the shared backend code).</p>
<p>Web app’s structure:</p>
<ol>
<li><strong>Backend:</strong>
	<ul>
	<li>- <i>Node.js</i> for runtime environment.</li>
	<li>- <i>Express.js</i> for server and API.</li>
	<li>- <i>MongoDB</i> for database.</li>
	<li>- <i>Mongoose.js</i> for interaction with the database.</li> 
	<li>- Authentication:
		<ul>
			<li>- <i> Bcrypt.js</i> for password-hashing.</li>
			<li>- <i> node-jsonwebtoken</i> for token generation.</li>
		</ul>
	</li>
	<li>-File Uploading: 
		<ul>
			<li>- <i>AWS SDK</i> for use of AWS services.</li>
<li>- <i>Multer</i> for handling multipart/form-data.</li>
<li>- <i>Multer S3</i> for streaming multer storage engine for AWS S3.</li>
		</ul>
</li>
</ul>
</li>
<li><strong>Frontend:</strong>
	<ul>
		<li>- <i>HTML</i></li>
		<li>- <i>CSS</i></li>
		<li>- <i>JavaScript</i></li>
		<li>- <i>ReactJS</i></li>
		<li>- State management:
	<ul>
		<li>- <i>Redux</i>.</li>
		<li>- <i>Redux Thunk</i> for a middleware.</li>
		<li>- <i>Local Storage</i> for storing user data and cart/shipping data.</li>
	</ul>
</li>
	</ul>
</li>
<li><strong>Payments:</strong>
	<ul>
		<li>- <i>PayPal SDK</i> for PayPal services.</li>
		<li>- <i>Stripe SDK</i> for Stripe services (used for CometShop Mobile App).</li>
	</ul>
</li>
</ol> 
<p>CometShop features a numeric pagination, searching, filtering and sorting. CometShop provides with file uploading when creating or updating products to upload product pictures.</p>
