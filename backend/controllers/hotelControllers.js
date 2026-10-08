import pool from "../db/database.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
  export const createHotel= async(req ,res) =>{
    
    try{
        const{
             title, description, latitude,longitude, price 
            }
            =req.body;

            let image = null;

            if (req.file) {
         const result = await uploadToCloudinary(req.file.buffer);
          image = result.secure_url;
}
            if (!title ||!description || latitude === undefined ||
                longitude === undefined ||price === undefined){


             return res.status(400).json({
              message: "All hotel fields are required"});

            }


              if (isNaN(price) || Number(price) <= 0) {
                 return res.status(400).json({
                  message: "Price must be a valid positive number"});
                }

            if (isNaN(latitude) || Number(latitude) < -90 ||
                Number(latitude) > 90) {
               return res.status(400).json({
                message: "Latitude must be between -90 and 90"});

            }
            
            const result  = await pool.query(`INSERT INTO hotels
                             (image,title,description, latitude,longitude,price)
                              VALUES($1,$2,$3,$4,$5,$6)RETURNING * `,
                              [image,title,description,latitude,longitude,price]);


                 res.status(201).json({
                 message: "Hotel created successfully",
                 hotel: result.rows[0]});

    }
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create hotel"});
    }
};

    export const getHotels = async (req, res) => {
    try {
        const {
            
            title,
            minPrice,
            maxPrice,
            limit = 10,
            offset = 0
        } = req.query;

        let query = `SELECT * FROM hotels`;
        let values = [];
        let conditions = [];

        if (title) {
            values.push(`%${title}%`);
            conditions.push(`title ILIKE $${values.length}`);
        }

        if (minPrice) {
            values.push(minPrice);
            conditions.push(`price >= $${values.length}`);
        }

        if (maxPrice) {
            values.push(maxPrice);
            conditions.push(`price <= $${values.length}`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ` + conditions.join(" AND ");
        }

        query += ` ORDER BY id DESC`;
        query += ` LIMIT $${values.length + 1}`;
        query += ` OFFSET $${values.length + 2}`;

        values.push(limit);
        values.push(offset);

        const result = await pool.query(query, values);

        res.status(200).json({
            hotels: result.rows});

    } 
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch hotels"});
    }
};
    export const updateHotel = async (req, res) => {
    try {

        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
      let image = null;

if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer);
    image = result.secure_url;
}        const { id } = req.params;

        const {
            title,
            description,
            latitude,
            longitude,
            price,
            
        } = req.body;



        
            if (!title ||!description || latitude === undefined ||
                longitude === undefined ||
                 price === undefined){


              return res.status(400).json({
                  message: "All hotel fields are required"});
            }


              if (isNaN(price) || Number(price) <= 0) {

              return res.status(400).json({
              message: "Price must be a valid positive number"});
            }

            if (isNaN(latitude) || Number(latitude) < -90 || 
             Number(latitude) > 90) {
                
               return res.status(400).json({
                message: "Latitude must be between -90 and 90" });
            }
        const result = await pool.query(
            `UPDATE hotels
             SET 
              image = COALESCE($1, image),
                 title = $2,
                 description = $3,
                 latitude = $4,
                 longitude = $5,
                 price = $6
                  WHERE id = $7
              
             RETURNING *`,
            [image,title, description, latitude, longitude, price, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found" });
        }

        res.status(200).json({
            message: "Hotel updated successfully",
            hotel: result.rows[0]});

    } 
    catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update hotel"});
    }
};

export const deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM hotels
             WHERE id = $1
             RETURNING *`,
            [id] );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Hotel not found"});
        }

        res.status(200).json({
            message: "Hotel deleted successfully",
            hotel: result.rows[0]});

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete hotel" });
    }
};
