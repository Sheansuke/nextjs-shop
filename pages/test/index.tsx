import { Button, Checkbox, TextField } from '@mui/material';
import { NextPage } from 'next'
import React from 'react'
import { useForm } from 'react-hook-form';

const TestPage: NextPage = () => {
    const { register, handleSubmit, getValues, setValue } = useForm({
        defaultValues: {
            checkes: ["Sheansuke", "Sheansuke2"]
        }
    })

    const onSubmit = (data: any) => {



    }

    const handleChange = (check) => {
        const array = getValues("checkes")

    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Checkbox
                checked={getValues("checkes").includes("Sheansuke")}
                onChange={() => handleChange("Sheansuke")}
            />



            <Button color="secondary" type="submit">
                test submit
            </Button>
        </form>
    )
}

export default TestPage