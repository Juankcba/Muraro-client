import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ListItem } from "react-native-elements";
import { map, isNull } from "lodash";
import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";
import ChangeDniForm from "./ChangeDniForm";

export default function AccountOptions(props) {
    const {
        userInfo,
        toastRef,
        setRealoadUserInfo,

    } = props;


    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);

    const selectedComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setRealoadUserInfo={setRealoadUserInfo}
                    />
                );
                setShowModal(true);
                break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        email={userInfo.email}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setRealoadUserInfo={setRealoadUserInfo}
                    />
                );
                setShowModal(true);
                break;
            case "password":
                setRenderComponent(
                    <ChangePasswordForm setShowModal={setShowModal} toastRef={toastRef} />
                );
                setShowModal(true);
                break;
            case "dni":
                setRenderComponent(
                    <ChangeDniForm dni={dni} setShowModal={setShowModal} toastRef={toastRef} />
                );
                setShowModal(true);
                break;
            default:
                setRenderComponent(null);
                setShowModal(false);
                break;
        }
    };
    const menuOptions = generateOptions(selectedComponent);
    if (email === null) {
        return (<Text>Debes de agregar el DNI</Text>);
    } else {
        return (
            <View>

                {map(menuOptions, (menu, index) => (
                    <ListItem
                        key={index}
                        title={menu.title}
                        leftIcon={{
                            type: menu.iconType,
                            name: menu.iconNameLeft,
                            color: menu.iconColorLeft,
                        }}
                        rightIcon={{
                            type: menu.iconType,
                            name: menu.iconNameRight,
                            color: menu.iconColorRight,
                        }}
                        containerStyle={styles.menuItem}
                        onPress={menu.onPress}
                    />
                ))}


                {renderComponent && (
                    <Modal isVisible={showModal} setIsVisible={setShowModal}>
                        {renderComponent}
                    </Modal>
                )}
            </View>
        );
    }
}

function generateOptions(selectedComponent) {

    return [
        {
            title: "Cambiar Nombre y Apellidos",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("displayName"),
        },
        {
            title: "Cambiar Email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("email"),
        },
        {
            title: "Cambiar contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("password"),
        },
        {
            title: "Cambiar DNI",
            iconType: "font-awesome",
            iconNameLeft: "address-card",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("dni"),
        },
    ];
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
    },
});