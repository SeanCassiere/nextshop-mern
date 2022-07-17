import React from "react";
import Alert from "./Alert";

import Button from "./Button";

const OrderSummary: React.FC<{
	error?: string;
	subtotalPrice?: number;
	shippingPrice?: number;
	taxPrice?: number;
	totalPrice?: number;
	actionButtonText?: string;
	actionButtonOnClick?: () => void;
	children?: React.ReactNode;
}> = ({
	error,
	subtotalPrice,
	shippingPrice,
	taxPrice,
	totalPrice,
	actionButtonText,
	actionButtonOnClick,
	children,
}) => {
	return (
		<div className='bg-gray-50 rounded-md py-6 px-4 sm:px-6'>
			<h2 id='summary-heading' className='text-lg font-medium text-gray-900'>
				Order summary
			</h2>

			<dl className='mt-6 space-y-4'>
				{subtotalPrice !== undefined && (
					<div className='flex items-center justify-between'>
						<dt className='text-sm text-gray-600'>Subtotal</dt>
						<dd className='text-sm font-medium text-gray-900'>${subtotalPrice?.toFixed(2)}</dd>
					</div>
				)}
				{shippingPrice !== undefined && (
					<div className='border-t border-gray-200 pt-4 flex items-center justify-between'>
						<dt className='flex items-center text-sm text-gray-600'>
							<span>Shipping estimate</span>
							{/* <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Learn more about how shipping is calculated</span>
                    <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
                  </a> */}
						</dt>
						<dd className='text-sm font-medium text-gray-900'>${shippingPrice?.toFixed(2)}</dd>
					</div>
				)}
				{taxPrice !== undefined && (
					<div className='border-t border-gray-200 pt-4 flex items-center justify-between'>
						<dt className='flex text-sm text-gray-600'>
							<span>Tax estimate</span>
							{/* <a href="#" className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
                    <span className="sr-only">Learn more about how tax is calculated</span>
                    <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
                  </a> */}
						</dt>
						<dd className='text-sm font-medium text-gray-900'>${taxPrice?.toFixed(2)}</dd>
					</div>
				)}
				{totalPrice !== undefined && (
					<div className='border-t border-gray-200 pt-4 flex items-center justify-between'>
						<dt className='text-base font-medium text-gray-900'>Order total</dt>
						<dd className='text-base font-medium text-gray-900'>${totalPrice?.toFixed(2)}</dd>
					</div>
				)}
			</dl>
			<div className='mt-6'>
				{error && (
					<Alert label='Something went wrong' variant='danger'>
						{error}
					</Alert>
				)}
				{actionButtonText && (
					<Button type='button' size='xl' onClick={actionButtonOnClick} fullWidth>
						{actionButtonText}
					</Button>
				)}
				{children}
			</div>
		</div>
	);
};

export default OrderSummary;
