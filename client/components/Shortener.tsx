import { CopyToClipboard } from "react-copy-to-clipboard";
import { useFormState } from "react-use-form-state";
import { Flex } from "reflexbox/styled-components";
import React, { useState } from "react";
import styled from "styled-components";
import getConfig from "next/config";

import { useStoreActions, useStoreState } from "../store";
import { Checkbox, Select, TextInput } from "./Input";
import { Col, RowCenterH, RowCenter, ColCenter } from "./Layout";
import { useMessage, useCopy } from "../hooks";
import { removeProtocol } from "../utils";
import Text, { H1, Span } from "./Text";
import { Link } from "../store/links";
import Animation from "./Animation";
import { Colors } from "../consts";
import Icon from "./Icon";
import {
  FacebookShareButton,
  EmailShareButton,
  TwitterShareButton,
  LinkedinShareButton
} from "react-share";
import Tooltip from "./Tooltip";
const { publicRuntimeConfig } = getConfig();

const SubmitIconWrapper = styled.div`
  content: "";
  position: absolute;
  top: 0;
  right: 12px;
  width: 64px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  :hover svg {
    fill: #673ab7;
  }
  @media only screen and (max-width: 448px) {
    right: 8px;
    width: 40px;
  }
`;

const SocialShareWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;

  @media (max-width: 670px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ShortenedLink = styled(H1)`
  cursor: "pointer";
  border-bottom: 1px dotted ${Colors.StatsTotalUnderline};
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

interface Form {
  target: string;
  domain?: string;
  customurl?: string;
  password?: string;
  description?: string;
  expire_in?: string;
  showAdvanced?: boolean;
}

const defaultDomain = publicRuntimeConfig.DEFAULT_DOMAIN;

const Shortener = () => {
  const { isAuthenticated } = useStoreState(s => s.auth);
  const domains = useStoreState(s => s.settings.domains);
  const submit = useStoreActions(s => s.links.submit);
  const [link, setLink] = useState<Link | null>(null);
  const [message, setMessage] = useMessage(3000);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useCopy();
  const [formState, { raw, password, text, select, label }] = useFormState<
    Form
  >(
    { showAdvanced: false },
    {
      withIds: true,
      onChange(e, stateValues, nextStateValues) {
        if (stateValues.showAdvanced && !nextStateValues.showAdvanced) {
          formState.clear();
          formState.setField("target", stateValues.target);
        }
      }
    }
  );

  const submitLink = async (reCaptchaToken?: string) => {
    try {
      const link = await submit({ ...formState.values, reCaptchaToken });
      setLink(link);
      formState.clear();
    } catch (err) {
      setMessage(
        err?.response?.data?.error || "Couldn't create the short link."
      );
    }
    setLoading(false);
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (loading) return;
    setCopied(false);
    setLoading(true);

    if (
      process.env.NODE_ENV === "production" &&
      !!publicRuntimeConfig.RECAPTCHA_SITE_KEY &&
      !isAuthenticated
    ) {
      window.grecaptcha.execute(window.captchaId);
      const getCaptchaToken = () => {
        setTimeout(() => {
          if (window.isCaptchaReady) {
            const reCaptchaToken = window.grecaptcha.getResponse(
              window.captchaId
            );
            window.isCaptchaReady = false;
            window.grecaptcha.reset(window.captchaId);
            return submitLink(reCaptchaToken);
          }
          return getCaptchaToken();
        }, 200);
      };
      return getCaptchaToken();
    }

    return submitLink();
  };

  const title = !link && (
    <H1 fontSize={[25, 27, 32]} light>
      Create shorter real estate links.
    </H1>
  );

  const result = link && (
    <Animation
      as={RowCenter}
      offset="-20px"
      duration="0.4s"
      style={{ position: "relative" }}
    >
      <SocialShareWrapper>
        <CopyToClipboard text={link.link} onCopy={setCopied}>
          <ShortenedLink fontSize={[24, 26, 30]} pb="2px" light>
            {removeProtocol(link.link)}
          </ShortenedLink>
        </CopyToClipboard>
        <Flex justifyContent="center" alignItems="center" my={3}>
          {copied ? (
            <Animation offset="10px" duration="0.2s" alignItems="center">
              <Icon
                size={[30, 35]}
                py={0}
                px={0}
                ml={3}
                p={["4px", "5px"]}
                name="check"
                strokeWidth="3"
                stroke={Colors.CheckIcon}
              />
            </Animation>
          ) : (
            <Animation offset="-10px" duration="0.2s">
              <CopyToClipboard
                text={link.link}
                onCopy={setCopied}
                data-tip
                data-for="CopyURL"
              >
                <Icon
                  as="button"
                  py={0}
                  px={0}
                  ml={3}
                  size={[30, 35]}
                  p={["6px", "7px"]}
                  name="copy"
                  strokeWidth="2.5"
                  stroke={Colors.CopyIcon}
                  backgroundColor={Colors.CopyIconBg}
                />
              </CopyToClipboard>
              <Tooltip id="CopyURL" effect="solid">
                <span>Copy</span>
              </Tooltip>
            </Animation>
          )}

          <FacebookShareButton
            url={link.link}
            quote={link.link}
            hashtag="#seeHome"
            style={{ outline: "none" }}
            data-tip
            data-for="FacebookShareButton"
          >
            <Icon ml={3} size={[30, 30]} name="facebook" />
          </FacebookShareButton>
          <Tooltip id="FacebookShareButton" effect="solid" >
            <span>Share on Facebook</span>
          </Tooltip>


          <TwitterShareButton
            url={link.link}
            via="seeHo.me"
            style={{ outline: "none" }}
            data-tip
            data-for="TwitterShareButton"
          >
            <Icon ml={3} size={[30, 30]} name="twitter" />
          </TwitterShareButton>
          <Tooltip id="TwitterShareButton" effect="solid">
            <span>Share on Twitter</span>
          </Tooltip>

          <LinkedinShareButton
            url={link.link}
            data-tip
            data-for="LinkedinShareButton"
            style={{ outline: "none" }}
            summary={"SeeHome"}
            title={link.link}
          >
            <Icon ml={3} size={[30, 30]} name="linkedIn" />
          </LinkedinShareButton>
          <Tooltip id="LinkedinShareButton" effect="solid">
            <span>Share on LinkedIn</span>
          </Tooltip>

          <EmailShareButton
            url={link.link}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick={() => { }}
            subject="I'd like you to see this home"
            body={`I found a home you may be interested in seeing: `}
            style={{ outline: "none", marginTop: "10px" }}
            openShareDialogOnClick={true}
            data-tip
            data-for="EmailShareButton"
          >
            <Icon ml={3} size={[30, 30]} name="email" />
          </EmailShareButton>
          <Tooltip id="EmailShareButton" effect="solid">
            <span>Send via Email</span>
          </Tooltip>

        </Flex>
      </SocialShareWrapper>
    </Animation>
  );

  return (
    <Col width={800} maxWidth="100%" px={[3]} flex="0 0 auto" mt={4}>
      <RowCenterH mb={[4, 48]}>
        {title}
        {result}
      </RowCenterH>

      <Flex
        as="form"
        id="shortenerform"
        width={1}
        alignItems="center"
        justifyContent="center"
        style={{ position: "relative" }}
        onSubmit={onSubmit}
      >
        <TextInput
          {...text("target")}
          placeholder="Paste your long URL"
          placeholderSize={[16, 17, 18]}
          fontSize={[18, 20, 22]}
          width={1}
          height={[58, 64, 72]}
          px={0}
          pr={[48, 84]}
          pl={[32, 40]}
          autoFocus
          data-lpignore
        />
        <SubmitIconWrapper onClick={onSubmit}>
          <Icon
            name={loading ? "spinner" : "send"}
            size={[22, 26, 28]}
            fill={loading ? "none" : "#aaa"}
            stroke={loading ? Colors.Spinner : "none"}
            mb={1}
            mr={1}
          />
        </SubmitIconWrapper>
      </Flex>
      {message.text && (
        <Text color={message.color} mt={24} mb={1} textAlign="center">
          {message.text}
        </Text>
      )}
      <Checkbox
        {...raw({
          name: "showAdvanced",
          onChange: e => {
            if (!isAuthenticated) {
              setMessage(
                "You need to log in or sign up to use advanced options."
              );
              return false;
            }
            return !formState.values.showAdvanced;
          }
        })}
        checked={formState.values.showAdvanced}
        label="Show advanced options"
        mt={[3, 24]}
        alignSelf="flex-start"
      />
      {formState.values.showAdvanced && (
        <div>
          <Flex mt={4} flexDirection={["column", "row"]}>
            <Col mb={[3, 0]}>
              <Text
                as="label"
                {...label("domain")}
                fontSize={[14, 15]}
                mb={2}
                bold
              >
                Domain:
              </Text>
              <Select
                {...select("domain")}
                data-lpignore
                pl={[3, 24]}
                pr={[3, 24]}
                fontSize={[14, 15]}
                height={[40, 44]}
                width={[1, 210, 240]}
                options={[
                  { key: defaultDomain, value: "" },
                  ...domains.map(d => ({
                    key: d.address,
                    value: d.address
                  }))
                ]}
              />
            </Col>
            <Col mb={[3, 0]} ml={[0, 24]}>
              <Text
                as="label"
                {...label("customurl")}
                fontSize={[14, 15]}
                mb={2}
                bold
              >
                {formState.values.domain || defaultDomain}/
              </Text>
              <TextInput
                {...text("customurl")}
                placeholder="Custom address..."
                autocomplete="off"
                data-lpignore
                pl={[3, 24]}
                pr={[3, 24]}
                placeholderSize={[13, 14]}
                fontSize={[14, 15]}
                height={[40, 44]}
                width={[1, 210, 240]}
              />
            </Col>
            <Col ml={[0, 24]}>
              <Text
                as="label"
                {...label("password")}
                fontSize={[14, 15]}
                mb={2}
                bold
              >
                Password:
              </Text>
              <TextInput
                {...password("password")}
                placeholder="Password..."
                autocomplete="off"
                data-lpignore
                pl={[3, 24]}
                pr={[3, 24]}
                placeholderSize={[13, 14]}
                fontSize={[14, 15]}
                height={[40, 44]}
                width={[1, 210, 240]}
              />
            </Col>
          </Flex>
          <Flex mt={[3]} flexDirection={["column", "row"]}>
            <Col mb={[3, 0]}>
              <Text
                as="label"
                {...label("expire_in")}
                fontSize={[14, 15]}
                mb={2}
                bold
              >
                Expire in:
              </Text>
              <TextInput
                {...text("expire_in")}
                placeholder="2 minutes/hours/days..."
                data-lpignore
                pl={[3, 24]}
                pr={[3, 24]}
                placeholderSize={[13, 14]}
                fontSize={[14, 15]}
                height={[40, 44]}
                width={[1, 210, 240]}
                maxWidth="100%"
              />
            </Col>
            <Col width={[1, 2 / 3]} ml={[0, 26]}>
              <Text
                as="label"
                {...label("description")}
                fontSize={[14, 15]}
                mb={2}
                bold
              >
                Description:
              </Text>
              <TextInput
                {...text("description")}
                placeholder="Description..."
                data-lpignore
                pl={[3, 24]}
                pr={[3, 24]}
                placeholderSize={[13, 14]}
                fontSize={[14, 15]}
                height={[40, 44]}
                width={1}
                maxWidth="100%"
              />
            </Col>
          </Flex>
        </div>
      )}
    </Col>
  );
};

export default Shortener;
