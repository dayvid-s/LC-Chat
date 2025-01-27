#!/bin/bash
#
# Print banner art.

#######################################
# Print a board. 
# Globals:
#   BG_BROWN
#   NC
#   WHITE
#   CYAN_LIGHT
#   RED
#   GREEN
#   YELLOW
# Arguments:
#   None
#######################################
print_banner() {

  clear

 printf "\n\n"

printf "${GREEN}";
printf "                                                     ▄▄█▀▀▀▀▀▀▀█▄▄  \n";
printf "                                                   ${GREEN}▄█▀${NC}   ${WHITE}▄▄${NC}      ${GREEN}▀█▄\n";
printf "                                                   ${GREEN}█${NC}    ${WHITE}███${NC}         ${GREEN}█\n";
printf "                                                   ${GREEN}█${NC}    ${WHITE}██▄         ${GREEN}█${NC}\n";
printf "                                                   ${GREEN}█${NC}     ${WHITE}▀██▄${NC} ${WHITE}██${NC}    ${GREEN}█\n";
printf "                                                   ${GREEN}█${NC}       ${WHITE}▀███▀${NC}    ${GREEN}█\n";
printf "                                                   ${GREEN}▀█▄           ▄█▀\n";
printf "                                                    ▄█    ▄▄▄▄█▀▀  \n";
printf "                                                    █  ▄█▀  ${WHITE}OxeTalk${NC}  \n";
printf "                                                    ▀▀▀▀          \n";
printf "${NC}";


  printf "\n"

  printf "${GREEN}";
  printf "SISTEMA DE MULTIATENDIMENTO OxeTalk\n";
  printf "SUPORTE: +5598299411-5837 OxeTalk    \n";
  printf "${NC}";

  printf "\n"
}
