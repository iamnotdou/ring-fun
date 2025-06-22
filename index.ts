import fungible_token from "./src/contracts/fungible_token"
import pool from "./src/contracts/pool"

;(async () => {
  const swap_res = await pool.swap({
    caller: "",
    is_in_x: true,
    amount_in: 2000n,
  })

  const data = await pool.get_quote({ is_in_x: true, amount_in: 2000n })
  console.log(data.result)

  pool.get_pool_info
})()
