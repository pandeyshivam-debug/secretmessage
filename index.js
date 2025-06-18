import express from "express"
import { z, ZodError } from "zod"
import { success } from "zod/v4"

const PORT = 3000
const app = express()
app.use(express.json())

const messages = []

const messageSchema = z.object({
    message: z.string().min(10, {message: "Message length must be in range [10, 180]"}).max(180, {message: "Message length must be in range [10, 180]"})
})


// app.post('/message', (req, res) => {
//     const parsedResult = messageSchema.parse(req.body)
//     console.log(parsedResult)
// })

app.get('/message', (req, res) => {
    try {
        const { message } = messageSchema.parse(req.body)

        const newMessage = {
            id: messages.length,
            message: message,
            createdAt: new Date()
        }
        messages.push(newMessage)

        res.status(200).json({
            success: true,
            message: "Your message was created successfully",
            data: message
        })
    } catch(err) {
        if(err instanceof ZodError) {
            res.status(400).json({
                success: false,
                errors: err.errors
            })
        }
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})

app.listen(PORT, () => {
    console.log(`app listening on PORT ${PORT}`)
})