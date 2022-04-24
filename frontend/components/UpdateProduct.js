import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/client";
import useForm from "../lib/useForm";
import Form from "./styles/Form";
import DisplayError from "./ErrorMessage";

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      name
      price
      description
      id
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String
    $description: String
    $price: Int
  ) {
    updateProduct(
      id: $id
      data: { name: $name, description: $description, price: $price }
    ) {
      name
      price
      description
      id
    }
  }
`;

const UpdateProduct = ({ id }) => {
  const { data, loading, error } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: {
      id,
    },
  });
  const [
    updateProduct,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProduct({
      variables: {
        id: id,
        name: inputs.name,
        description: inputs.description,
        price: inputs.price,
      },
    });
    // clearForm();
    // Router.push({
    //   pathname: `/product/${res.data.createProduct.id}`,
    // });
  };

  const { inputs, handleChange, clearForm, resetForm } = useForm(data?.Product);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Form onSubmit={handleSubmit}>
      <DisplayError error={error || updateError} />
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
        <label htmlFor="name">
          Name
          <input
            type="text"
            id="name"
            name="name"
            placeholder="name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Product</button>
      </fieldset>
    </Form>
  );
};

export default UpdateProduct;
