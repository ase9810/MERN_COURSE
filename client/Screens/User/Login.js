import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Button } from "react-native";
import FormContainer from "../../Shared/Form/FormContainer";
import Input from "../../Shared/Form/Input";
import Error from "../../Shared/Error";
import EasyButton from "../../Shared/StyledComponents/EasyButton";

// Context
import AuthGlobal from "../../Context/store/AuthGlobal";
import { loginUser } from "../../Context/actions/Auth.actions";
import { Container } from "native-base";
import AsyncStorage from "@react-native-community/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseURL";
import { logoutUser } from "../../Context/actions/Auth.actions";
import Toast from "react-native-toast-message";
// import { useFocusEffect } from "@react-navigation/native";

const Login = (props) => {
	const context = useContext(AuthGlobal);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const [userProfile, setUserProfile] = useState();
	const [orders, setOrders] = useState();

	// useFocusEffect(() => {
	// 	if (context.stateUser.isAuthenticated === true) {
	// 		props.navigation.navigate("User Profile");
	// 	}
	// }, [context.stateUser.isAuthenticated]);

	console.log(context.stateUser.isAuthenticated);

	useEffect(() => {
		if (context.stateUser.isAuthenticated) {
			AsyncStorage.getItem("jwt")
				.then((res) => {
					axios
						.get(`${baseURL}users/${context.stateUser.user.userId}`, {
							headers: { Authorization: `Bearer ${res}` },
						})
						.then((user) => setUserProfile(user.data))
						.catch((err) => console.log(err));
				})
				.catch((error) => console.log(error));

			axios
				.get(`${baseURL}orders`)
				.then((x) => {
					const data = x.data;
					const userOrders = data.filter((order) => order.user._id === context.stateUser.user.userId);
					setOrders(userOrders);
				})
				.catch((error) => console.log(error));

			return () => {
				setUserProfile();
				setOrders();
			};
		}
	}, [context.stateUser.isAuthenticated]);

	const handleSubmit = () => {
		const user = {
			email,
			password,
		};

		if (email === "" || password === "") {
			setError("Please fill in your credentials");
		} else {
			loginUser(user, context.dispatch);
			Toast.show({
				topOffset: 60,
				type: "success",
				text1: "Login Successful!!!",
				autoHide: true,
				visibilityTime: 1000,
			});
			props.navigation.navigate("Home");
		}
	};

	return (
		<>
			{context.stateUser.isAuthenticated === true ? (
				<Container style={styles.container}>
					<ScrollView contentContainerStyle={styles.subContainer}>
						<Text style={{ fontSize: 30 }}>{userProfile ? userProfile.name : ""}</Text>
						<View style={{ marginTop: 20 }}>
							<Text style={{ margin: 10 }}>Email: {userProfile ? userProfile.email : ""}</Text>
							<Text style={{ margin: 10 }}>Phone: {userProfile ? userProfile.phone : ""}</Text>
						</View>
						<View style={{ marginTop: 80 }}>
							<Button
								title={"Sign Out"}
								onPress={() => [
									AsyncStorage.removeItem("jwt"),
									logoutUser(context.dispatch),
									Toast.show({
										topOffset: 60,
										type: "success",
										text1: "Logout Successful!!!",
										autoHide: true,
										visibilityTime: 1000,
									}),
								]}
							/>
						</View>
						<View style={styles.order}>
							<Text style={{ fontSize: 20 }}>My Orders</Text>
							<View>
								{orders ? (
									orders.map((x) => {
										return <OrderCard key={x.id} {...x} />;
									})
								) : (
									<View style={styles.order}>
										<Text>You have no orders</Text>
									</View>
								)}
							</View>
						</View>
					</ScrollView>
				</Container>
			) : (
				<FormContainer title={"Login"}>
					<Input
						placeholder={"Enter Email"}
						name={"email"}
						id={"email"}
						value={email}
						onChangeText={(text) => setEmail(text.toLowerCase())}
					/>
					<Input
						placeholder={"Enter Password"}
						name={"password"}
						id={"password"}
						secureTextEntry={true}
						value={password}
						onChangeText={(text) => setPassword(text)}
					/>
					<View style={styles.buttonGroup}>
						{error ? <Error message={error} /> : null}
						<EasyButton large primary onPress={() => handleSubmit()}>
							<Text style={{ color: "white" }}>Login</Text>
						</EasyButton>
					</View>
					<View style={[{ marginTop: 40 }, styles.buttonGroup]}>
						<Text style={styles.middleText}>Don't have an account yet?</Text>
						<EasyButton large secondary onPress={() => props.navigation.navigate("Register")}>
							<Text style={{ color: "white" }}>Register</Text>
						</EasyButton>
					</View>
				</FormContainer>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	buttonGroup: {
		width: "80%",
		alignItems: "center",
	},
	middleText: {
		marginBottom: 20,
		alignSelf: "center",
	},
	container: {
		flex: 1,
		alignItems: "center",
	},
	subContainer: {
		alignItems: "center",
		marginTop: 60,
	},
	order: {
		marginTop: 20,
		alignItems: "center",
		marginBottom: 60,
	},
});

export default Login;
