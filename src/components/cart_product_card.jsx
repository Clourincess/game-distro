import {
  Button,
  HStack,
  Image,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { observer } from "mobx-react-lite";
import { useStores } from "../store/store_context";
import base_url from "../store/vars";

const CartProductCard = observer(({ obj }) => {
  const { userStore } = useStores();
  const toast = useToast();

  const deleteToCart = async () => {
    const response = await fetch(`${base_url}/games/cart/${obj?.id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${userStore.auth_token}`,
      },
    });
    if (response.ok) {
      await userStore.getCart(userStore?.auth_token);
    }
    return response.ok;
  };

  const isInCart = userStore.cart?.some((item) => item?.id == obj?.id);

  // для незарегистрированного пользователя
  const handleToTempCart = () => {
    let newCart;

    if (isInCart) {
      newCart = userStore.cart?.filter((item) => item?.id != obj?.id);
      toast({
        title: "Товар удален из корзины",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      userStore.updateCart(newCart);
    }
  };

  const handleCart = async () => {
    if (isInCart) {
      const ok = await deleteToCart();
      if (ok) {
        toast({
          title: "Товар удален из корзины",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      }
    }
  };
  return (
    <VStack
      padding={"0"}
      border={"1px solid rgba(56, 72, 87, 1)"}
      borderRadius={"8px"}
      width={"160px"}
      align={"flex-start"}
      height={"220px"}
      gap={0}
    >
      <Image
        src={`http://212.41.9.251:8013/${obj?.picture_url}`}
        height={"100px"}
        borderTopRadius={"6px"}
      />
      <HStack align={"flex-start"}>
        <VStack
          width={"100%"}
          justify={"space-between"}
          align={"flex-start"}
          marginTop={"8px"}
          marginLeft={"8px"}
        >
          <Text
            color={"rgba(248, 250, 252, 1)"}
            fontWeight={"500"}
            fontSize={"16px"}
            width={"max-content"}
            whiteSpace={"nowrap"}
            textOverflow={"ellipsis"}
            overflow={"hidden"}
            maxWidth={"150px"}
          >
            {obj?.name}
          </Text>
          <HStack>
            <Text
              textDecoration={
                obj?.price == "0" || obj?.discount == "0"
                  ? "none"
                  : "line-through"
              }
              color={
                obj?.price == "0"
                  ? "rgba(248, 250, 252, 1)"
                  : "rgba(0, 84, 87, 1)"
              }
            >
              {obj?.price == "0" ? "Free" : `${obj?.price} ₽`}
            </Text>
            {obj?.price == "0" || obj?.discount == "0" ? null : (
              <Text color={"rgba(248, 250, 252, 1)"}>
                {parseInt(Number(obj?.price * (1 - obj?.discount / 100)))} ₽
              </Text>
            )}
          </HStack>
        </VStack>
      </HStack>
      <Button
        marginTop={"10px"}
        borderTopRadius={0}
        alignSelf={"center"}
        width={"100%"}
        bg={"rgba(14, 18, 22, 1)"}
        borderTop={"1px solid rgba(56, 72, 87, 1)"}
        _hover={{
          bg: "rgba(56, 72, 87, 1)",
        }}
        onClick={async () =>
          userStore.auth_token ? await handleCart() : handleToTempCart()
        }
      >
        <Text
          color={"rgba(248, 250, 252, 1)"}
          width={"max-content"}
          fontSize={"14px"}
        >
          Убрать из корзины
        </Text>
      </Button>
    </VStack>
  );
});

export default CartProductCard;
