import React, {useState} from "react"
import {Info, TextInput, Button, Field} from "@aragon/ui"
import styled from 'styled-components'

const PanelContainer = styled.div`
    display: flex;
    flex-direction: column;
`
const InfoContainer = styled(Info.Action)`
    margin-top: 30px;
`

const InputField = ({id, inputFieldLabel, inputFieldType, onChange}) => {

    const handleChange = event => {
        const text = event.target.value;
        onChange(id, text);
    }

    return (
        <Field css={`margin-top: 28px;`} label={inputFieldLabel} required>
            <TextInput type={inputFieldType} wide
                       onChange={handleChange}/>
        </Field>
    )
}

// inputFieldList must represent the arguments to handleSubmit and id's must be in the order of the arguments
const GenericInputPanel = ({actionTitle, actionDescription, inputFieldList, submitLabel, handleSubmit}) => {

    const [inputFieldData, setInputFieldData] = useState({})

    const handleFieldChange = (fieldId, value) => {
        setInputFieldData({...inputFieldData, [fieldId]: value})
    }

    const inputFields = inputFieldList.map(inputField => (
        <InputField key={inputField.id}
                    id={inputField.id}
                    inputFieldLabel={inputField.label}
                    inputFieldType={inputField.type}
                    onChange={handleFieldChange}
        />
    ));


    const sortedInputFieldData = () => Object.fromEntries(
        Object.entries(inputFieldData).sort( (a,b) => a[0] - b[0] )
    )

    return (
        <PanelContainer>

            {inputFields}

            <Button css={`margin-top: 10px;`} mode="strong" onClick={() => {
                handleSubmit(...Object.values(sortedInputFieldData()))
            }}>
                {submitLabel}
            </Button>

            <InfoContainer title={actionTitle}>
                {actionDescription}
            </InfoContainer>

        </PanelContainer>
    )
}

export default GenericInputPanel