// Code generated by https://github.com/gagliardetto/anchor-go. DO NOT EDIT.

package locked_voter

import (
	"bytes"
	"fmt"
	ag_spew "github.com/davecgh/go-spew/spew"
	ag_binary "github.com/gagliardetto/binary"
	ag_solanago "github.com/gagliardetto/solana-go"
	ag_text "github.com/gagliardetto/solana-go/text"
	ag_treeout "github.com/gagliardetto/treeout"
)

var ProgramID ag_solanago.PublicKey = ag_solanago.MustPublicKeyFromBase58("H4PQ8qs4owAaZog4SpeTeh7StN2ogoGitnyKX9Xkqo94")

func SetProgramID(pubkey ag_solanago.PublicKey) {
	ProgramID = pubkey
	ag_solanago.RegisterInstructionDecoder(ProgramID, registryDecodeInstruction)
}

const ProgramName = "LockedVoter"

func init() {
	if !ProgramID.IsZero() {
		ag_solanago.RegisterInstructionDecoder(ProgramID, registryDecodeInstruction)
	}
}

var (
	Instruction_NewLocker = ag_binary.TypeID([8]byte{177, 133, 32, 90, 229, 216, 131, 47})

	Instruction_NewEscrow = ag_binary.TypeID([8]byte{216, 182, 143, 11, 220, 38, 86, 185})

	Instruction_Lock = ag_binary.TypeID([8]byte{21, 19, 208, 43, 237, 62, 255, 87})

	Instruction_Exit = ag_binary.TypeID([8]byte{234, 32, 12, 71, 126, 5, 219, 160})

	Instruction_ActivateProposal = ag_binary.TypeID([8]byte{90, 186, 203, 234, 70, 185, 191, 21})

	Instruction_CastVote = ag_binary.TypeID([8]byte{20, 212, 15, 189, 69, 180, 69, 151})

	Instruction_SetVoteDelegate = ag_binary.TypeID([8]byte{46, 236, 241, 243, 251, 108, 156, 12})

	Instruction_SetLockerParams = ag_binary.TypeID([8]byte{106, 39, 132, 84, 254, 77, 161, 169})

	Instruction_ApproveProgramLockPrivilege = ag_binary.TypeID([8]byte{75, 202, 1, 4, 122, 110, 102, 148})

	Instruction_RevokeProgramLockPrivilege = ag_binary.TypeID([8]byte{170, 151, 7, 88, 194, 86, 245, 112})
)

// InstructionIDToName returns the name of the instruction given its ID.
func InstructionIDToName(id ag_binary.TypeID) string {
	switch id {
	case Instruction_NewLocker:
		return "NewLocker"
	case Instruction_NewEscrow:
		return "NewEscrow"
	case Instruction_Lock:
		return "Lock"
	case Instruction_Exit:
		return "Exit"
	case Instruction_ActivateProposal:
		return "ActivateProposal"
	case Instruction_CastVote:
		return "CastVote"
	case Instruction_SetVoteDelegate:
		return "SetVoteDelegate"
	case Instruction_SetLockerParams:
		return "SetLockerParams"
	case Instruction_ApproveProgramLockPrivilege:
		return "ApproveProgramLockPrivilege"
	case Instruction_RevokeProgramLockPrivilege:
		return "RevokeProgramLockPrivilege"
	default:
		return ""
	}
}

type Instruction struct {
	ag_binary.BaseVariant
}

func (inst *Instruction) EncodeToTree(parent ag_treeout.Branches) {
	if enToTree, ok := inst.Impl.(ag_text.EncodableToTree); ok {
		enToTree.EncodeToTree(parent)
	} else {
		parent.Child(ag_spew.Sdump(inst))
	}
}

var InstructionImplDef = ag_binary.NewVariantDefinition(
	ag_binary.AnchorTypeIDEncoding,
	[]ag_binary.VariantType{
		{
			"new_locker", (*NewLocker)(nil),
		},
		{
			"new_escrow", (*NewEscrow)(nil),
		},
		{
			"lock", (*Lock)(nil),
		},
		{
			"exit", (*Exit)(nil),
		},
		{
			"activate_proposal", (*ActivateProposal)(nil),
		},
		{
			"cast_vote", (*CastVote)(nil),
		},
		{
			"set_vote_delegate", (*SetVoteDelegate)(nil),
		},
		{
			"set_locker_params", (*SetLockerParams)(nil),
		},
		{
			"approve_program_lock_privilege", (*ApproveProgramLockPrivilege)(nil),
		},
		{
			"revoke_program_lock_privilege", (*RevokeProgramLockPrivilege)(nil),
		},
	},
)

func (inst *Instruction) ProgramID() ag_solanago.PublicKey {
	return ProgramID
}

func (inst *Instruction) Accounts() (out []*ag_solanago.AccountMeta) {
	return inst.Impl.(ag_solanago.AccountsGettable).GetAccounts()
}

func (inst *Instruction) Data() ([]byte, error) {
	buf := new(bytes.Buffer)
	if err := ag_binary.NewBorshEncoder(buf).Encode(inst); err != nil {
		return nil, fmt.Errorf("unable to encode instruction: %w", err)
	}
	return buf.Bytes(), nil
}

func (inst *Instruction) TextEncode(encoder *ag_text.Encoder, option *ag_text.Option) error {
	return encoder.Encode(inst.Impl, option)
}

func (inst *Instruction) UnmarshalWithDecoder(decoder *ag_binary.Decoder) error {
	return inst.BaseVariant.UnmarshalBinaryVariant(decoder, InstructionImplDef)
}

func (inst *Instruction) MarshalWithEncoder(encoder *ag_binary.Encoder) error {
	err := encoder.WriteBytes(inst.TypeID.Bytes(), false)
	if err != nil {
		return fmt.Errorf("unable to write variant type: %w", err)
	}
	return encoder.Encode(inst.Impl)
}

func registryDecodeInstruction(accounts []*ag_solanago.AccountMeta, data []byte) (interface{}, error) {
	inst, err := DecodeInstruction(accounts, data)
	if err != nil {
		return nil, err
	}
	return inst, nil
}

func DecodeInstruction(accounts []*ag_solanago.AccountMeta, data []byte) (*Instruction, error) {
	inst := new(Instruction)
	if err := ag_binary.NewBorshDecoder(data).Decode(inst); err != nil {
		return nil, fmt.Errorf("unable to decode instruction: %w", err)
	}
	if v, ok := inst.Impl.(ag_solanago.AccountsSettable); ok {
		err := v.SetAccounts(accounts)
		if err != nil {
			return nil, fmt.Errorf("unable to set accounts for instruction: %w", err)
		}
	}
	return inst, nil
}
