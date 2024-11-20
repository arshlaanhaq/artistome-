const payBtn = document.querySelector('.btn-buy');
payBtn.addEventListener('click', () => {
  const cartItems = localStorage.getItem('cartItems');
  const items = cartItems ? JSON.parse(cartItems) : []; // Handle empty cart

  console.log('cartItems:', cartItems); // Log cart items for debugging
  console.log('Request Body:', JSON.stringify({ items })); // Log request body

  fetch('/stripe-checkout', {
    method: 'post',
    headers: new Headers({'Content-Type': 'application/json'}),
    body: JSON.stringify({ items }),
  })
  .then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.json();
  })
  .then((data) => {
    // Check if the response has the expected structure
    if (data.url) {
      location.href = data.url; // Redirect to the URL provided in the response
    } else {
      console.error('No URL returned in response:', data);
    }
    clearCart();
  })
  .catch((err) => console.error('Fetch error:', err));
});
