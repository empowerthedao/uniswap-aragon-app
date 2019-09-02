import React from 'react'
import PropTypes from 'prop-types'
import {useNetwork} from '@aragon/api-react'
import {IdentityBadge} from '@aragon/ui'

const AddressBadge = ({entity, badgeOnly, compact}) => {
    const network = useNetwork()

    return (
        <IdentityBadge
            customLabel={''}
            entity={entity}
            networkType={network && network.type}
            badgeOnly
            compact
        />
    )
}

AddressBadge.propTypes = {
    entity: PropTypes.string.isRequired,
}

export default AddressBadge
