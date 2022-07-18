import React from "react";
import { useLocation, useMatch, useNavigate } from "@tanstack/react-location";
import { Helmet } from "react-helmet-async";
import { useMutation, useQuery, useQueryClient } from "react-query";

import Header from "../../components/Header";
import StoreProduct from "../../components/StoreProduct";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Button from "../../components/Button";

import { useAuth } from "../../context/AuthContext";
import { Product } from "../../types/Product";
import { ResponseParsed } from "../../api/base";
import { getPublicProductById } from "../../api/products";
import { LocationGenerics } from "../../App";
import Checkbox from "../../components/Checkbox";
import { adminUpdateProduct, AdminUpdateProductDTO } from "../../api/admin";

const formKeys = ["name", "image", "brand", "category", "description", "price", "countInStock", "isActive"];

const ProductEdit = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queryClient = useQueryClient();

	const {
		params: { productId },
	} = useMatch<LocationGenerics>();

	const { user } = useAuth();
	const token = user?.token ?? "";

	const [formData, setFormData] = React.useState<Product | null>(null);

	const { data: productQuery } = useQuery<ResponseParsed<Product>, any>(
		["products", productId],
		() => getPublicProductById(productId),
		{
			onError: () => {
				navigate({ to: "/admin/products" });
			},
			onSuccess: (res) => {
				setFormData(res.data);
			},
		}
	);

	const { mutate: updateProduct, isLoading: isUpdating } = useMutation<
		ResponseParsed<Product>,
		any,
		AdminUpdateProductDTO
	>(adminUpdateProduct, {
		onSuccess: () => {
			queryClient.invalidateQueries(["admin", "products"]);
			queryClient.invalidateQueries(["products"]);
			location.history.back();
		},
	});

	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		if (formKeys.includes(name)) {
			if (name === "price" || name === "countInStock") {
				setFormData((prev) => {
					if (!prev) return null;
					return { ...prev, [name]: Number(value) };
				});
			} else {
				setFormData((prev) => {
					if (!prev) return null;
					return { ...prev, [name]: value };
				});
			}
		}
	};

	return (
		<React.Fragment>
			<Header />
			<Helmet>
				<title>Edit - {`${productQuery?.data?.name}`} | Nextshop</title>
			</Helmet>
			<main>
				<section className='pb-7'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col'>
						<div className='py-5'>
							<button onClick={() => location.history.back()} className='rounded-md py-2 px-4 bg-none hover:bg-gray-50'>
								Go Back
							</button>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-12 gap-5'>
							<div className='sm:col-span-5 md:col-span-3'>
								<div className='flex md:justify-center md:items-center md:sticky md:top-[4.5rem]'>
									{formData && <StoreProduct product={formData} disableLinkFollow />}
								</div>
							</div>
							<div className='sm:col-span-7 md:col-span-9'>
								<div className='max-w-lg '>
									<h2 className='text-3xl mb-4 font-bold tracking-tight text-gray-900'>Edit product</h2>
									<p className='mt-2 text-sm text-gray-500'>
										Manage the displayed information and pricing of this item.
									</p>
									{formData && (
										<form
											className='pt-5 flex flex-col gap-5'
											onSubmit={(e) => {
												e.preventDefault();
												updateProduct({
													token,
													productId,
													name: formData.name,
													image: formData.image,
													brand: formData.brand,
													category: formData.category,
													description: formData.description,
													price: formData.price,
													countInStock: formData.countInStock,
													isActive: formData.isActive,
												});
											}}
										>
											<div className='flex flex-col gap-5'>
												<Input
													label='Product name'
													name='name'
													type='text'
													value={formData.name}
													onChange={handleFormChange}
													required
												/>
												<Input
													label='Image URL'
													name='image'
													type='text'
													value={formData.image}
													onChange={handleFormChange}
													required
												/>
												<Input
													label='Brand name'
													name='brand'
													type='text'
													value={formData.brand}
													onChange={handleFormChange}
													required
												/>
												<Input
													label='Category'
													name='category'
													type='text'
													value={formData.category}
													onChange={handleFormChange}
													required
												/>
												<TextArea
													label='Description'
													name='description'
													rows={5}
													value={formData.description}
													onChange={handleFormChange}
													required
												/>
												<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
													<Input
														label='Price $'
														type='number'
														name='price'
														value={formData.price}
														onChange={handleFormChange}
														min={0}
														step={0.01}
														required
													/>
													<Input
														label='Stock (Units)'
														type='number'
														name='countInStock'
														value={formData.countInStock}
														onChange={handleFormChange}
														min={0}
														step={1}
														required
													/>
												</div>
												<Checkbox
													label='Available on store?'
													name='isActive'
													defaultChecked={formData.isActive}
													onChange={(e) => {
														setFormData((prev) => {
															if (!prev) return null;
															return { ...prev, [e.target.name]: Boolean(e.target.checked) };
														});
													}}
												/>
											</div>
											<div>
												<Button type='submit' disabled={isUpdating}>
													Save
												</Button>
											</div>
										</form>
									)}
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</React.Fragment>
	);
};

export default ProductEdit;
