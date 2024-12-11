import { AnyZodObject } from "zod";

interface IRequestValidator {
    query?: AnyZodObject,
    body?: AnyZodObject,
    params?: AnyZodObject
}

export default IRequestValidator