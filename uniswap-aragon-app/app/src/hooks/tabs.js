import {useState, useCallback} from 'react'
import Swap from "../components/swap/Swap";
import Settings from "../components/settings/Settings";

export function useTabs() {

    const tabs = [
        {
            index: 0,
            id: 'SWAP',
            tabName: 'Swap',
        },
        {
            index: 1,
            id: 'SETTINGS',
            tabName: 'Settings',
        }
    ]

    const [tabBarSelected, setTabBarSelected] = useState(tabs[0])

    const names = tabs.map(tab => tab.tabName)
    const selected = tabs.findIndex(item => item.id === tabBarSelected.id)

    const selectTab = useCallback((tabIndex) => {
        setTabBarSelected(tabs[tabIndex])
    }, [tabBarSelected])

    return { names, tabBarSelected, selectTab, selected }
}